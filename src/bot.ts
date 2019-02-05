import Telegraf from 'telegraf';
import { InlineQuery } from '@update/inline-query.update';
import { ENSProvider } from '@eth/ens.eth';
import { Address } from '@eth/address.eth';
import { ENSCommand } from '@command/ens.command';
import { NewCommand } from '@command/new.command';

export class EtherleyBot {

    public bot: any
    public ens: ENSProvider = new ENSProvider()

    constructor(token: string) {
        console.log(`Setting new bot with token ${token}`)
        this.bot = new Telegraf(token)
    }

    init() {
        console.log('Initializing bot')
        this.bot.use((ctx, next) => {
            console.log(ctx.message)
            console.log(ctx.inlineQuery)
            console.log(ctx.from)
            console.log(ctx)
            return next(ctx).then(res => {
                console.log(res)
            })
        })

        this.bot.catch((err) => {
            console.log('Ooops', err)
        })

        this.bot.on('inline_query', ctx => {
            this.parseInlineQuery(ctx)
        })

        this.handleCommands()

        this.onStart()
        this.onHelp()

        this.bot.launch()
    }

    onStart() {
        this.bot.start(ctx => ctx.reply(`Hi, I'm Etherley,\nthe most reliable Ethereum bot.\n\nI can handle several tasks for you, like generating a wallet, register and search for ENS names, sign transactions, interact with smart-contracts and send ETH payments.\n\nType /help for more...`))
    }

    onHelp() {
        this.bot.help(ctx => ctx.reply(`Use these commands to summon me anytime, anywhere:`, {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: '/new',
                        },
                        {
                            text: '/ens',
                        },
                    ],
                ],
            }
        }))
    }

    handleCommands() {
        this.bot.command(['ens', 'ENS'], ctx => { (new ENSCommand(ctx)).reply() })
        this.bot.command(['new', 'NEW', 'New', 'newwallet'], ctx => { (new NewCommand(ctx)).reply() })
    }

    async parseInlineQuery(ctx: any) {
        console.info('INLINE QUERY')
        console.log(ctx.inlineQuery)

        const IQ: InlineQuery = new InlineQuery(ctx.inlineQuery.query, ctx)

        let response;
        if (IQ.isENSAddress()) {
            console.log(`${IQ.query} is ENS Address`)
            try {
                const address: Address = await this.ens.lookup(IQ.query)
                response = IQ.makeENSResponse(address)
            } catch (address) {
                response = IQ.makeENSResponse(address)
            }
            ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, response)
        }
    }

}
