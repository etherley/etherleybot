import { Address } from '@eth/address.eth';
import { ENSProvider } from '@eth/ens.eth';

export class ENSCommand {

    ctx: any
    ens: ENSProvider = new ENSProvider()

    constructor(ctx) {
        this.ctx = ctx
    }

    reply() {
        console.log(this.ctx.update)
        const text = this.ctx.update.message.text
        const regex = new RegExp(/([a-z0-9\.][a-z0-9-\.]+[a-z0-9]\.eth)/, 'gi')
        if (regex.test(text)) {
            const names = text.match(regex)
            this.ctx.reply(`Searching for ENS names: ${names.join(', ')}`)
            this.searchENSArray(names)
        } else {
            this.ctx.reply('No ENS names detected')
        }
    }

    private searchENSArray(names: Array<string>) {
        console.log(names)
        if (names.length <= 0) {
            return false
        }
        const name = names.shift()
        setTimeout(async () => {
            try {
                const response: Address = await this.ens.lookup(name)
                this.ctx.reply(`Found ENS for ${name}: ${response.toChecksumAddress()}`)
            } catch (error) {
                this.ctx.reply(`No ENS name found for ${name}. Register it at https://ens.domains`)
            }
            this.searchENSArray(names)
        }, 5000)

    }

}
