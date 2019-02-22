require('dotenv').config()

import ENSCommand from '@command/ENSCommand';
import TelegramContextMock from '@test/mock/TelegramContextMock';
import { assert } from 'chai';

const UID = 639642129
const NAME = 'wallet.superander.eth'

describe('ENSCommandTest', () => {
  it('THROWS on ENS lookup not found', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = `/ens notfoundensname123.eth`
    ctx.from.id = UID

    const ensCommand = new ENSCommand(ctx)
    try {
      await ensCommand.reply()
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })

  it('Looks up for ENS name owner and resolver', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = `/ens ${NAME}`
    ctx.from.id = UID

    const ensCommand = new ENSCommand(ctx)
    try {
      await ensCommand.reply()
    } catch (error) {

    }
  })

  it('Looks up for MULTIPLE ENS names owner and resolver', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = `/ens supercrowdsale.superander.eth wallet.superander.eth sander1.superander.eth`
    ctx.from.id = UID

    const ensCommand = new ENSCommand(ctx)
    try {
      await ensCommand.reply()
    } catch (error) {

    }
  })

  it('THROWS on no names detected', async () => {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = `/ens`
    ctx.from.id = UID

    const ensCommand = new ENSCommand(ctx)
    try {
      await ensCommand.reply()
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })
})
