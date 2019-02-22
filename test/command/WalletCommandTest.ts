require('dotenv').config()

import WalletCommand from '@command/WalletCommand';
import TelegramContextMock from '@test/mock/TelegramContextMock';
import VaultContract, { IWalletStruct } from '@contract/VaultContract';
import { assert } from 'chai';

const UID = 639642129
const ALIAS = 'my-wallet-alias.eth'
const TO = '0xF0653c636027f5D9F8325053D8c22eaB74080257'

describe('WalletCommandTest', () => {
  it('creates a new wallet for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = `/wallet new ${ALIAS}`
    ctx.from.id = UID

    const walletCommand = new WalletCommand(ctx)
    try {
      await walletCommand.reply()
    } catch (error) {
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
      assert.instanceOf(error, Error)
    }
    console.log(ctx.message.text)
  })

  it('FAILS when SENDING ETH to an address from wallet with LESS BALANCE than VALUE for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = `/wallet ${ALIAS}  send (123.555) to ${TO}`
    ctx.from.id = UID

    const walletCommand = new WalletCommand(ctx)
    try {
      await walletCommand.reply()
    } catch (error) {
      assert.instanceOf(error, Error)
    }
    console.log(ctx.message.text)
  })

  it('SENDS value to another address for Telegram UID', async () => {
    try {
      const ctx = new TelegramContextMock()
      ctx.update.message.text = `/wallet ${ALIAS}  send (3.5) to ${TO}`
      ctx.from.id = UID

      const walletCommand = new WalletCommand(ctx)
      const vaultContract = new VaultContract()
      vaultContract.connect()

      const { wallets: addresses } = await vaultContract.getWalletAddressesByUserID(ctx.from.id)

      const wallets = await Promise.all(addresses.map(address => {
        return vaultContract.getWallet(ctx.from.id, address)
      }))

      const [
        wallet
      ] = wallets.filter((w: IWalletStruct) => {
        return w._alias === ALIAS
      }) as Array<IWalletStruct>

      const value = vaultContract.web3.utils.toWei('5', 'ether')

      const txOptions = {
        from: process.env.BOT_ADDRESS,
        to: wallet._address,
        value: value,
        gas: '21000',
      }
      const signedTx = await vaultContract.web3.eth.accounts.signTransaction(txOptions, process.env.BOT_PRIVATE_KEY)
      const receipt = await vaultContract.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      await walletCommand.reply()
      console.log(ctx.message.text)
    } catch (error) {
    }
  })

  it('REJECTS a NEW WALLET creation for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = `/wallet new ${ALIAS}`
    ctx.from.id = UID

    const walletCommand = new WalletCommand(ctx)
    try {
      await walletCommand.reply()
    } catch (error) {
      assert.instanceOf(error, Error)
    }
    console.log(ctx.message.text)
  })

  it('Gets a wallet BALANCE for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = `/wallet balance ${ALIAS}`
    ctx.from.id = UID

    const walletCommand = new WalletCommand(ctx)
    await walletCommand.reply()

    console.log(ctx.message.text)
  })

  it('FAILS on GETTING BALANCE of wallet for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = '/wallet balance my-wallet-aliassss.eth'
    ctx.from.id = UID

    const walletCommand = new WalletCommand(ctx)
    try {
      await walletCommand.reply()
    } catch (error) {
      assert.instanceOf(error, Error)
    }
    console.log(ctx.message.text)
  })

  it('Gets a LIST of wallets for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = '/wallet list'
    ctx.from.id = UID

    const walletCommand = new WalletCommand(ctx)
    try {
      await walletCommand.reply()
    } catch (error) {
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
      assert.instanceOf(error, Error)
    }
    console.log(ctx.message.text)
  })

  it('FAILS when generating a QR Code on RECEIVE from wallet with WRONG ALIAS for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = '/wallet my-wallet_aliasss.eth receive'
    ctx.from.id = UID

    const walletCommand = new WalletCommand(ctx)
    try {
      await walletCommand.reply()
    } catch (error) {
      assert.instanceOf(error, Error)
    }
    console.log(ctx.message.text)
  })

  it('Generates a QR Code of a wallet address by alias for Telegram UID', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = `/wallet receive ${ALIAS}`
    ctx.from.id = UID

    const walletCommand = new WalletCommand(ctx)
    await walletCommand.reply()

    console.log(ctx.messagePhoto)
  })
})
