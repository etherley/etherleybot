import { ENSProvider } from '@eth/ens.eth';
import jsonfile from 'jsonfile';
import * as fs from 'fs';

export class NewCommand {

  ctx: any
  ens: ENSProvider = new ENSProvider()

  constructor(ctx) {
    this.ctx = ctx
  }

  reply() {
    const text = this.ctx.update.message.text
    const regex = new RegExp(/wallet/, 'gi')
    if (regex.test(text)) {
      // TODO
      // Create random wallet with alias
      // Regex should check for /new wallet {alias}
      // encrypt it
      // Store it in Vault
      // Send the public address back only
    } else {
      this.ctx.reply(`/New what?`, {
        reply_markup: {
          keyboard: [
            [
              {
                text: '/new wallet',
              },
              {
                text: '/new erc20',
              },
            ],
            [
              {
                text: '/new ICO',
              },
              {
                text: '/new relationship',
              },
            ],
          ],
        }
      })
    }
  }

  sendAsFile(name: string, obj: any) {
    const file = `/tmp/${name}.json`

    jsonfile.writeFile(file, obj).then(() => {
      jsonfile.readFile(file).then(_obj => {

        this.ctx.reply(`This is a fresh Ethereum wallet.\n\nI WILL NOT STORE THIS FOR YOU, you must download it and store it somewhere that only you know:`)
        this.ctx.replyWithDocument({ source: file })

      }).catch(err => console.log(err))

      setTimeout(() => {
        fs.unlink(file, (err) => {
          if (err) { console.log(err) }
        })
      }, 10000)

    }).catch(err => console.log(err))
  }
}
