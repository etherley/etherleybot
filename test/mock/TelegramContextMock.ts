import { Update, Message } from 'telegram-typings';

export default class TelegramContextMock {

  update = <Update>{
    message: <Message>{}
  }

}
