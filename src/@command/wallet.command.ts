import { ENSProvider } from '@eth/ens.eth';

export default class WalletCommand {

  name = '/wallet'

  ctx: any
  ens: ENSProvider = new ENSProvider()

  actions = new RegExp(/^(?<action>new|export|address)\b/, 'gm')
  options = {
    new: new RegExp(/(?<alias>[\w\-]+)$/, 'gm')
  }

  constructor(ctx) {
    this.ctx = ctx
  }

  reply() {
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
    exec[action].fn(exec[action].args)
  }

  onNew([alias]) {
    console.log(alias)
    // TODO
    // Convert alias to bytes32
    // Create new randomWallet
    // Link UID to wallet alias and address in Vault
    // Encrypt new wallet mnemonic and privateKey
    // Store encrypted values in VaultContract struct Wallet
    // Respond to the user with:
    // Your wallet has been created: address: 0x0, alias: alias, balance: 0.0. Check your balance at anytime with /wallet balance {alias}. Deposit funds to your wallet with /deposit {wallet alias} {amount} {currency (optional)}
  }
}
