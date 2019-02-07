import Telegraf, { ContextMessageUpdate } from 'telegraf';
import { InlineQuery } from '@update/inline-query.update';
import { ENSProvider } from '@eth/ens.eth';
import { Address } from '@eth/address.eth';
import { ENSCommand } from '@command/ens.command';
import { NewCommand } from '@command/new.command';
import { DepositCommand } from '@command/deposit.command';
import { StartCommand } from '@command/start.command';
import { HelpCommand } from '@command/help.command';
import { PreCheckoutQuery } from '@update/pre-checkout-query.update';

export class EtherleyBot {

  public bot: any

  constructor(token: string) {
    this.bot = new Telegraf(token)
  }

  init() {
    console.log('Initializing bot')
    this.bot.use((ctx: ContextMessageUpdate, next) => {
      console.log(ctx.message)
      console.log(ctx.inlineQuery)
      console.log(ctx.from)
      console.log(ctx)
      return next(ctx)
    })

    this.bot.catch((err) => {
      console.log('Ooops', err)
    })

    this.handleCommands()
    this.handleUpdateTypes()
    this.bot.launch()
  }

  handleUpdateTypes() {
    this.bot.on('inline_query', (ctx: ContextMessageUpdate) => { (new InlineQuery(ctx)).reply() })
    this.bot.on('pre_checkout_query', (ctx: ContextMessageUpdate) => { (new PreCheckoutQuery(ctx)).reply() })
  }

  handleCommands() {
    this.bot.start((ctx: ContextMessageUpdate) => { (new StartCommand(ctx).reply()) })
    this.bot.help((ctx: ContextMessageUpdate) => { (new HelpCommand(ctx).reply()) })
    this.bot.command(['ens', 'ENS', 'Ens'], (ctx: ContextMessageUpdate) => { (new ENSCommand(ctx)).reply() })
    this.bot.command(['new', 'NEW', 'New'], (ctx: ContextMessageUpdate) => { (new NewCommand(ctx)).reply() })
    this.bot.command(['deposit', 'DEPOSIT', 'Deposit'], (ctx: ContextMessageUpdate) => { (new DepositCommand(ctx)).reply() })
  }
}
