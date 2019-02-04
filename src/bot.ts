import Telegraf from 'telegraf';
import { InlineQuery } from '@update/inline-query.update';
import { ENSProvider } from '@eth/ens.eth';

export class EtherleyBot {

    public bot: any
    public ens: ENSProvider = new ENSProvider()

    constructor(token: string) {
        console.log(`Setting new bot with token ${token}`)
        this.bot = new Telegraf(token)
    }

    init() {
        console.log('Initializing bot')
        // this.bot.use((ctx: any) => {
        //     console.log(ctx.message)
        //     console.log(ctx.inlineQuery)
        //     console.log(ctx.from)
        //     console.log(ctx)
        // })

        this.bot.on('inline_query', ctx => this.parseInlineQuery(ctx))

        this.bot.start((ctx: any) => ctx.reply('Welcome'))
        this.bot.help((ctx: any) => ctx.reply('Send me a sticker'))
        this.bot.on('sticker', (ctx: any) => ctx.reply('👍'))
        this.bot.hears('hi', (ctx: any) => ctx.reply('Hey there'))
        this.bot.launch()
    }

    parseInlineQuery(ctx: any) {
        console.info('INLINE QUERY')
        console.log(ctx.inlineQuery)

        const IQ: InlineQuery = new InlineQuery(ctx.inlineQuery.query, ctx)

        if (IQ.isENSAddress()) {
            console.log(`${IQ.query} is ENS Address`)
            this.ens.lookup(IQ.query)
            // IQ.makeENSResponse()
        }
    }

}
