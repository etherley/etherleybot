import Telegraf, { ContextMessageUpdate } from 'telegraf';
import { InlineQuery } from '@update/inline-query.update';
import { ENSCommand } from '@command/ens.command';
import { NewCommand } from '@command/new.command';
import { DepositCommand } from '@command/deposit.command';
import { StartCommand } from '@command/StartCommand';
import { HelpCommand } from '@command/HelpCommand';
import { PreCheckoutQuery } from '@update/pre-checkout-query.update';
import { SuccesfulPaymentQuery } from '@update/successful-payment-query.update';
import WalletCommand from '@command/WalletCommand';

export default class EtherleyBot {

  public bot: any

  constructor(token: string) {
    this.bot = new Telegraf(token)
  }

  stop() {
    this.bot.stop()
    return this
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
    return this
  }

  launch() {
    this.bot.launch()
    return this
  }

  handleUpdateTypes() {
    this.bot.on('inline_query', (ctx: ContextMessageUpdate) => { (new InlineQuery(ctx)).reply() })
    this.bot.on('pre_checkout_query', (ctx: ContextMessageUpdate) => { (new PreCheckoutQuery(ctx)).reply() })
    this.bot.on('successful_payment', (ctx: ContextMessageUpdate) => { (new SuccesfulPaymentQuery(ctx)).reply() })
    return this
  }

  handleCommands() {
    this.bot.start((ctx: ContextMessageUpdate) => { (new StartCommand(ctx).reply()) })
    this.bot.help((ctx: ContextMessageUpdate) => { (new HelpCommand(ctx).reply()) })
    this.bot.command(['ens', 'ENS', 'Ens'], (ctx: ContextMessageUpdate) => { (new ENSCommand(ctx)).reply() })
    this.bot.command(['new', 'NEW', 'New'], (ctx: ContextMessageUpdate) => { (new NewCommand(ctx)).reply() })
    this.bot.command(['wallet', 'WALLET', 'Wallet'], (ctx: ContextMessageUpdate) => { (new WalletCommand(ctx)).reply() })
    this.bot.command(['deposit', 'DEPOSIT', 'Deposit'], (ctx: ContextMessageUpdate) => { (new DepositCommand(ctx)).reply() })
    return this
  }
}
