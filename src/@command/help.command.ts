import { ContextMessageUpdate } from 'telegraf';

export class HelpCommand {

  ctx: ContextMessageUpdate

  constructor(ctx: ContextMessageUpdate) {
    this.ctx = ctx
  }

  reply() {
    this.ctx.reply(`Use these commands to summon me anytime, anywhere:`, {
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
    })
  }
}
