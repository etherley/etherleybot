import WalletCommand from '@command/wallet.command';
import TelegramContextMock from '@test/mock/TelegramContextMock';

export default class WalletCommandTest {

  constructor() {
    console.info(`[TEST] WalletCommandTest`)
  }

  run() {
    const ctx = new TelegramContextMock()
    ctx.update.message.text = 'new my-wallet_alias'

    const walletCommand = new WalletCommand(ctx)
    walletCommand.reply()
  }

}
