import { ContextMessageUpdate } from 'telegraf';
import { IncomingMessage, SuccessfulPayment } from 'telegraf/typings/telegram-types';

export class SuccesfulPaymentQuery {

  ctx: ContextMessageUpdate

  constructor(ctx: any) {
    this.ctx = ctx
  }

  async reply() {
    console.log(this.ctx.message)
    // TODO store this.ctx.message.provider_payment_charge_id somewhere with the user id transactions?
    // TODO convert total_amount to ETH and transfer to invoice_payload.address as deposit
    const {
      currency,
      total_amount,
      invoice_payload,
      telegram_payment_charge_id,
      provider_payment_charge_id
    } = this.ctx.message.successful_payment

    // TODO get total_amount minus fees
    this.ctx.reply(`Awesome. Now I'm transferring ${currency}${(total_amount / 100).toFixed(2)} to your selected ETH address. You can now send ETH or sign transactions. I'll let you know if you've run out of balance.\n\nExport your wallet at any time with "/wallet export" or type /help for more.`)
  }

}
