import { ContextMessageUpdate } from 'telegraf';

export class StartCommand {

  ctx: ContextMessageUpdate

  constructor(ctx: ContextMessageUpdate) {
    this.ctx = ctx
  }

  reply() {
    this.ctx.reply(`Hi, I'm Etherley,\nthe most reliable Ethereum bot.\n\nUse these commands to get through the Ethereum blockchain:\n\n/wallet\n/ens\n\nType /help for more...`)
  }
}
