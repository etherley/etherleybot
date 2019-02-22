import { Address } from '@eth/address.eth';
import { ENSProvider } from '@eth/ENSProvider';

export default class ENSCommand {

  ctx: any
  ens: ENSProvider = new ENSProvider()

  constructor(ctx) {
    this.ctx = ctx
  }

  reply() {
    return new Promise(async (resolve, reject) => {
      const text = this.ctx.update.message.text
      const regex = new RegExp(/([a-z0-9\.][a-z0-9-\.]+[a-z0-9]\.eth)/, 'gi')
      if (regex.test(text)) {
        const names = text.match(regex)
        this.ctx.reply(`Searching for ENS names: ${names.join(', ')}`)
        try {
          console.log(names)
          await Promise.all(names.map(name => {
            return this._searchENSArray(name)
          }))
          resolve()
        } catch (error) {
          reject(error)
        }
      } else {
        this.ctx.reply('No ENS names detected')
        reject(new Error(`[ENSCommand] no .eth names detected`))
      }
    })
  }

  private _searchENSArray(name: string) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const owner: Address = await this.ens.owner(name)
          this.ctx.reply(`ENS for ${name} is owned by ${owner.toChecksumAddress()}. https://etherscan.io/enslookup?q=${name}`)
          const response: Address = await this.ens.lookup(name)
          this.ctx.reply(`Found ENS resolver for ${name}: https://etherscan.io/address/${name}`)
          resolve()
        } catch (error) {
          this.ctx.reply(`${error.message}. Register it at https://myetherwallet.com`)
          reject(error)
        }
      }, 5000)
    })
  }

}
