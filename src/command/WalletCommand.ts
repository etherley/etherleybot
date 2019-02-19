import Wallet from '@eth/wallet.eth';
import VaultContract from '@contract/VaultContract';
import { ContextMessageUpdate } from 'telegraf';

export default class WalletCommand {

  name = '/wallet'

  ctx: ContextMessageUpdate

  actions = new RegExp(/^(?<action>new|balance|export|address)\b/, 'gm')
  options = {
    new: new RegExp(/(?<alias>[\w\-]+)$/, 'gm')
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
        }
      }

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

  onNew = ([alias]): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        // TODO
        // Check that alias does not exist in user Vault. Do we really need to check this?

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
        // Your wallet has been created: address: 0x0, alias: alias, balance: 0.0. Check your balance at anytime with /wallet balance {alias}. Deposit funds to your wallet with /deposit {wallet alias} {amount} {currency (optional)}
        resolve(`Your wallet has been created: address: ${wallet.address.toString()}, alias: ${alias}, balance: ${balance}.\nCheck your balance at anytime with /wallet balance {alias}. Deposit funds to your wallet with /deposit {wallet alias} {amount} {currency (optional)}`)
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }
}
