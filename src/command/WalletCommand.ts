import Wallet from '@eth/wallet.eth';
import VaultContract, { IWalletStruct } from '@contract/VaultContract';
import { ContextMessageUpdate } from 'telegraf';
import * as fs from 'fs';
import qrcode from 'qrcode-generator';

export default class WalletCommand {

  name = '/wallet'

  ctx: ContextMessageUpdate

  actions = new RegExp(/^(?<action>new|balance|list|receive|export)\b/, 'gm')
  options = {
    new: new RegExp(/(?<alias>[\w\-]+)$/, 'gm'),
    balance: new RegExp(/(?<alias>[\w\-]+)$/, 'gm'),
    receive: new RegExp(/(?<alias>[\w\-]+)$/, 'gm'),
  }

  constructor(ctx) {
    this.ctx = ctx
  }

  async reply(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const text: string = this.ctx.update.message.text

      const [
        action,
      ] = text.match(this.actions)

      const exec = {
        new: {
          fn: this.onNew,
          args: text.match(this.options.new)
        },
        balance: {
          fn: this.onBalance,
          args: text.match(this.options.balance)
        },
        list: {
          fn: this.onList,
          args: null
        },
        receive: {
          fn: this.onReceive,
          args: text.match(this.options.receive)
        },
      }

      // TODO check for expected options

      console.info(`[${this.name}] [${action}] [${exec[action].args}]`)
      try {
        const response = await exec[action].fn(exec[action].args)
        this.ctx.reply(response)
        resolve()
      } catch (error) {
        console.error(error)
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

        // const path = `/tmp/${wallet._address}.png`

        // fs.writeFile(path, base64Data, 'base64', (error) => {
        //   reject(error)
        //   console.error(error)
        // })

        const file = Buffer.from(base64Data, 'base64')

        this.ctx.replyWithPhoto({ source: file }, { caption: `${wallet._address}` })

        // fs.readFile(path, (error, file) => {
        //   if (error) {
        //     console.error(error)
        //     reject(error)
        //   }
        // })

        resolve(`${wallet._address}`)
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

        const wallets = await Promise.all(addresses.map(address => {
          return vaultContract.getWallet(this.ctx.from.id, address)
        }))

        const list = await Promise.all(wallets.map(async (w: IWalletStruct) => {
          const wei = await vaultContract.web3.eth.getBalance(w._address)
          const balance = vaultContract.web3.utils.fromWei(wei)
          return `Alias: ${w._alias}\nAddress: ${w._address}\nBalance: Ξ${balance}\n\n`
        }))

        resolve(`Your wallets:\n${list.join('')}`)
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }

  onBalance = ([alias]): Promise<string> => {
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

        resolve(`Wallet\nAlias: ${wallet._alias}\nAddress: ${wallet._address}\nBalance: Ξ${balance}`)
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }

  onNew = ([alias]): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Create new randomWallet
        const wallet = new Wallet()
        wallet.generateRandom()

        // Encrypt new wallet mnemonic and privateKey
        const vaultContract = new VaultContract()
        vaultContract.connect()
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
        resolve(`Your wallet has been created:\nAddress: ${wallet.address.toString()}\nAlias: ${alias}\nBalance: Ξ${balance}\n\nCheck your balance at anytime with /wallet balance {alias}. Deposit funds to your wallet with /deposit {wallet alias} {amount} {currency (optional)}`)
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }
}
