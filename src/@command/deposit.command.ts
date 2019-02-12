import { NewInvoiceParams, LabeledPrice } from 'telegraf/typings/telegram-types';
import { ContextMessageUpdate } from 'telegraf';

export class DepositCommand {

  ctx: ContextMessageUpdate

  constructor(ctx: ContextMessageUpdate) {
    this.ctx = ctx
  }

  reply() {
    // TODO: check if the user has an ETH address in /wallet registry
    // TODO: ask the user for an amount
    // TODO: ask the user for a currency?

    // Possible SYNTAX: /deposit [amount] [currency] in [ETH address OR address alias OR ENS address]

    const price = {
      label: 'Fiat Deposit',
      amount: 100000
    } as LabeledPrice

    const currency = 'MXN'

    const params = {
      chat_id: this.ctx.message.chat.id,
      title: 'Fiat Deposit',
      description: `Use ${currency} to pay with Ethereum. Withdraw at any time. Type /wallet for options.`,
      payload: '{address: 0x24b2e8c86cc5a378b184b64728db1a8484d844ec}',
      provider_token: process.env.STRIPE_TEST_PROVIDER_TOKEN,
      start_parameter: 'deposit-invoice-123',
      currency: currency,
      prices: [price],
    } as NewInvoiceParams

    this.ctx.replyWithInvoice(params)
  }
}


