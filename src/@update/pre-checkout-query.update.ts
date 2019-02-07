import { ContextMessageUpdate } from 'telegraf';

export class PreCheckoutQuery {

  ctx: ContextMessageUpdate

  constructor(ctx: any) {
    this.ctx = ctx
  }

  async reply() {
    this.ctx.answerPreCheckoutQuery(true)
  }

}
