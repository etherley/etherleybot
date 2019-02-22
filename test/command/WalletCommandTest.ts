require('dotenv').config()

import WalletCommand from '@command/WalletCommand';
import TelegramContextMock from '@test/mock/TelegramContextMock';
import { assert } from 'chai';

const UID = 639642125
const ALIAS = 'my-wallet-alias.eth'

describe('WalletCommandTest', () => {
  it('creates a new wallet for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = `/wallet new ${ALIAS}`
    ctx.from.id = UID

    const walletCommand = new WalletCommand(ctx)
    try {
      await walletCommand.reply()
    } catch (error) {
      console.error(error)
    }
    console.log(ctx.message.text)
  })

  it('FAILS when SENDING ETH to an address from wallet with WRONG ALIAS for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = '/wallet my-wallet_aliasss.eth  send (123.555) to 0x3303A197394e6fA6064f13775a6F09a03d4d178D  '
    ctx.from.id = UID

    const walletCommand = new WalletCommand(ctx)
    try {
      await walletCommand.reply()
    } catch (error) {
      console.error(error)
      assert.instanceOf(error, Error)
    }
    console.log(ctx.message.text)
  })

  it('rejects a new wallet creation for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = `/wallet new ${ALIAS}`
    ctx.from.id = UID

    const walletCommand = new WalletCommand(ctx)
    try {
      await walletCommand.reply()
    } catch (error) {
      console.error(error)
      assert.instanceOf(error, Error)
    }
    console.log(ctx.message.text)
  })

  it('Gets a wallet balance for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = `/wallet balance ${ALIAS}`
    ctx.from.id = UID

    const walletCommand = new WalletCommand(ctx)
    await walletCommand.reply()

    console.log(ctx.message.text)
  })

  it('Gets a list of wallets for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = '/wallet list'
    ctx.from.id = UID

    const walletCommand = new WalletCommand(ctx)
    try {
      await walletCommand.reply()
    } catch (error) {
      console.error(error)
    }
    console.log(ctx.message.text)
  })

  it('FAILS on GETTING list of wallets for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = '/wallet list'
    ctx.from.id = 123456

    const walletCommand = new WalletCommand(ctx)
    try {
      await walletCommand.reply()
    } catch (error) {
      console.error(error)
      assert.instanceOf(error, Error)
    }
    console.log(ctx.message.text)
  })

  // it('Generates a QR Code of a wallet address by alias for Telegram UID', async () => {
  //   const ctx = new TelegramContextMock()
  //   ctx.update.message.text = 'receive my-wallet_alias-3'
  //   ctx.from.id = UID

  //   const walletCommand = new WalletCommand(ctx)
  //   await walletCommand.reply()

  //   console.log(ctx.message.text)
  // })
})
