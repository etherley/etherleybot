import Wallet from '@eth/wallet.eth';
import VaultContract, { IWalletStruct } from '@contract/VaultContract';
import { ContextMessageUpdate } from 'telegraf';
import qrcode from 'qrcode-generator';
import BigNumber from 'bn.js';

export default class WalletCommand {

  name = '/wallet'

  ctx: ContextMessageUpdate

  actions = new RegExp(/(?<action>new|balance|list|receive|send|export).*/, 'gm')
  options = {
    new: new RegExp(/(?<alias>[\w\-]+\.eth)$/, 'gm'),
    balance: new RegExp(/(?<alias>[\w\-]+\.eth)$/, 'gm'),
    receive: new RegExp(/(?<alias>[\w\-]+\.eth)$/, 'gm'),
    send: new RegExp(/(?<alias>[\w\-]+\.eth).*(?<value>\(\d*\.?\d+\)).*(?<address>0x[a-fA-F0-9]{40}).*/, 'gm'),
  }

  constructor(ctx) {
    this.ctx = ctx
  }

  reply(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const text: string = this.ctx.update.message.text

      const match = this.actions.exec(text)
      const {
        action,
      } = match['groups']

      const exec = {
        new: {
          fn: this.onNew,
          args: this.options.new
        },
        balance: {
          fn: this.onBalance,
          args: this.options.balance
        },
        list: {
          fn: this.onList,
          args: null
        },
        receive: {
          fn: this.onReceive,
          args: this.options.receive
        },
        send: {
          fn: this.onSend,
          args: this.options.send
        },
      }

      if (!exec[action]) {
        this.ctx.reply(`There is no action for your command. Please ensure that:\n\n- Your wallet alias ends with ".eth". eg. my-wallet-alias.eth`)
        throw new Error(`[WalletCommand] No action for [${text}]`)
      }

      try {
        if (exec[action].args === null) {
          console.info(`[WalletCommand] [${this.name}] [${action}]`)
          await exec[action].fn()
          resolve()
        }

        const args = exec[action].args.exec(text)
        if (args['groups']) {
          console.info(`[WalletCommand] [${this.name}] [${action}] [${args[0]}]`)
          await exec[action].fn(args['groups'])
          resolve()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  onReceive = ([alias]): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const vaultContract = new VaultContract()
        vaultContract.connect()

        const { wallets: addresses } = await vaultContract.getWalletAddressesByUserID(this.ctx.from.id)

        const wallets = await Promise.all(addresses.map(address => {
          return vaultContract.getWallet(this.ctx.from.id, address)
        }))

        const [
          wallet
        ] = wallets.filter((w: IWalletStruct) => {
          return w._alias === alias
        }) as Array<IWalletStruct>

        const qr = qrcode(0, 'H')
        qr.addData(wallet._address)
        qr.make()
        const base64Data = qr.createDataURL(6, 2).replace(/^data:image\/gif;base64,/, '')

        const file = Buffer.from(base64Data, 'base64')
        this.ctx.replyWithPhoto({ source: file }, { caption: `${wallet._address}` })
        resolve()
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }

  onList = (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const vaultContract = new VaultContract()
        vaultContract.connect()

        const { wallets: addresses } = await vaultContract.getWalletAddressesByUserID(this.ctx.from.id)

        if (!addresses.length) {
          this.ctx.reply(`You have no wallets yet. Create a wallet by typing "/wallet new {your-wallet-alias}.eth"`)
          throw new Error(`[WalletCommand] no wallets for user [${this.ctx.from.id}]`)
        }

        const wallets = await Promise.all(addresses.map(address => {
          return vaultContract.getWallet(this.ctx.from.id, address)
        }))

        const list = await Promise.all(wallets.map(async (w: IWalletStruct) => {
          const wei = await vaultContract.web3.eth.getBalance(w._address)
          const balance = vaultContract.web3.utils.fromWei(wei)
          return `Alias: ${w._alias}\nAddress: ${w._address}\nBalance: Ξ${balance}\n\n`
        }))

        this.ctx.reply(`Your wallets:\n\n${list.join('')}`)
        resolve()
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }

  onSend = ({ alias, value, address: to }): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const _value = value.replace(/\(|\)/gm, '')

        const vaultContract = new VaultContract()
        vaultContract.connect()

        const { wallets: addresses } = await vaultContract.getWalletAddressesByUserID(this.ctx.from.id)

        const wallets = await Promise.all(addresses.map(address => {
          return vaultContract.getWallet(this.ctx.from.id, address)
        }))

        const [
          wallet
        ] = wallets.filter((w: IWalletStruct) => {
          return w._alias === alias
        }) as Array<IWalletStruct>

        if (!wallet) {
          this.ctx.reply(`There is no wallet with this alias: ${alias}`)
          throw new Error(`[WalletCommand] no wallet with specified alias [${alias}] for user [${this.ctx.from.id}]`)
        }

        const wei = await vaultContract.web3.eth.getBalance(wallet._address)
        const balance = vaultContract.web3.utils.fromWei(wei)

        if (BigNumber(wei).lte(BigNumber(_value))) {
          this.ctx.reply(`Insufficient balance for wallet:\n\nAlias: ${wallet._alias}\nAddress: ${wallet._address}\nBalance: Ξ${balance}`)
          throw new Error(`[WalletCommand] no wallet with specified alias [${alias}] for user [${this.ctx.from.id}]`)
        }

        await Promise.all([
          vaultContract.decrypt(Buffer.from(wallet.privateKey, 'hex'), 'privateKey'),
        ])

        vaultContract.onTxHash.then(hash => console.log(hash))

        const receipt = await vaultContract.send(wallet._address, to, vaultContract.web3.utils.fromWei(_value, 'ether'))
        console.log(receipt)

        this.ctx.reply(`Wallet\n\nAlias: ${wallet._alias}\nAddress: ${wallet._address}\nBalance: Ξ${balance}`)
        resolve()
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }

  onBalance = ({ alias }): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const vaultContract = new VaultContract()
        vaultContract.connect()

        const { wallets: addresses } = await vaultContract.getWalletAddressesByUserID(this.ctx.from.id)

        const wallets = await Promise.all(addresses.map(address => {
          return vaultContract.getWallet(this.ctx.from.id, address)
        }))

        const [
          wallet
        ] = wallets.filter((w: IWalletStruct) => {
          return w._alias === alias
        }) as Array<IWalletStruct>

        const wei = await vaultContract.web3.eth.getBalance(wallet._address)
        const balance = vaultContract.web3.utils.fromWei(wei)

        this.ctx.reply(`Wallet\n\nAlias: ${wallet._alias}\nAddress: ${wallet._address}\nBalance: Ξ${balance}`)
        resolve()
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }

  onNew = ({ alias }): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const vaultContract = new VaultContract()
        vaultContract.connect()

        const { wallets: addresses } = await vaultContract.getWalletAddressesByUserID(this.ctx.from.id)

        const wallets = await Promise.all(addresses.map(address => {
          return vaultContract.getWallet(this.ctx.from.id, address)
        }))

        const [
          _wallet
        ] = wallets.filter((w: IWalletStruct) => {
          return w._alias === alias
        }) as Array<IWalletStruct>

        if (_wallet) {
          const _wei = await vaultContract.web3.eth.getBalance(_wallet._address.toString())
          const _balance = vaultContract.web3.utils.fromWei(_wei)
          this.ctx.reply(`You already have a wallet with that alias:\n\nAlias: ${_wallet._alias}\nAddress: ${_wallet._address}\nBalance: Ξ${_balance}`)
          throw new Error(`[WalletCommand] a wallet with specified alias [${alias}] for user [${this.ctx.from.id}] already exists.`)
        }

        // Create new randomWallet
        const wallet = new Wallet()
        wallet.generateRandom()
        // Encrypt new wallet mnemonic and privateKey
        await Promise.all([
          vaultContract.encrypt(wallet.mnemonic, 'mnemonic'),
          vaultContract.encrypt(wallet.privateKey, 'privateKey'),
        ])

        // Store encrypted values in VaultContract struct Wallet
        await vaultContract.storeWallet(
          this.ctx.from.id,
          wallet.address.toString(),
          alias
        )

        // Get the balance of the new wallet
        const wei = await vaultContract.web3.eth.getBalance(wallet.address.toString())
        const balance = vaultContract.web3.utils.fromWei(wei)

        // Respond to the user with:
        this.ctx.reply(`Your wallet has been created:\n\nAddress: ${wallet.address.toString()}\nAlias: ${alias}\nBalance: Ξ${balance}\n\nCheck your balance at anytime with "/wallet balance {alias}.eth". Deposit funds to your wallet with "/deposit ({amount}) {currency} in {wallet-alias}.eth"`)
        resolve()
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }
}
