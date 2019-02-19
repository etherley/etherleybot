require('dotenv').config()

import WalletCommand from '@command/WalletCommand';
import TelegramContextMock from '@test/mock/TelegramContextMock';
import { assert } from 'chai';

const UID = 639642123

describe('WalletCommandTest', () => {
  // it('creates a new wallet for Telegram UID', async () => {
  //   const ctx = new TelegramContextMock()
  //   ctx.update.message.text = 'new my-wallet_alias-9'
  //   ctx.from.id = UID

  //   const walletCommand = new WalletCommand(ctx)
  //   await walletCommand.reply()

  //   console.log(ctx.message.text)
  // })

  // it('Gets a wallet balance for Telegram UID', async () => {
  //   const ctx = new TelegramContextMock()
  //   ctx.update.message.text = 'balance my-wallet_alias-3'
  //   ctx.from.id = UID

  //   const walletCommand = new WalletCommand(ctx)
  //   await walletCommand.reply()

  //   console.log(ctx.message.text)
  // })

  // it('Gets a list of wallets for Telegram UID', async () => {
  //   const ctx = new TelegramContextMock()
  //   ctx.update.message.text = 'list'
  //   ctx.from.id = UID

  //   const walletCommand = new WalletCommand(ctx)
  //   await walletCommand.reply()

  //   console.log(ctx.message.text)
  // })

  it('Generates a QR Code of a wallet address by alias for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = 'receive my-wallet_alias-3'
    ctx.from.id = UID

    const walletCommand = new WalletCommand(ctx)
    await walletCommand.reply()

    console.log(ctx.message.text)
  })
})
