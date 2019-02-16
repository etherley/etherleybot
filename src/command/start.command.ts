import { ContextMessageUpdate } from 'telegraf';

export class StartCommand {

  ctx: ContextMessageUpdate

  constructor(ctx: ContextMessageUpdate) {
    this.ctx = ctx
  }

  reply() {
    this.ctx.reply(`Hi, I'm Etherley,\nthe most reliable Ethereum bot.\n\nI can handle several tasks for you, like generating a wallet, register and search for ENS names, sign transactions, interact with smart-contracts and send ETH payments.\n\nType /help for more...`)
  }
}


