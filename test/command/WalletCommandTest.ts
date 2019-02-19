require('dotenv').config()

import WalletCommand from '@command/WalletCommand';
import TelegramContextMock from '@test/mock/TelegramContextMock';
import { assert } from 'chai';

const UID = 639642123

describe('WalletCommandTest', () => {
  it('creates a new wallet for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = 'new my-wallet_alias'
    ctx.from.id = UID

    const walletCommand = new WalletCommand(ctx)
    await walletCommand.reply()

    console.log(ctx.message.text)
  })
})
