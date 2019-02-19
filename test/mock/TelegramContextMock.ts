import {
  Update,
  Message as TelegramMessage,
  User,
  Chat as TelegramChat
} from 'telegram-typings';

import {
  ContextMessageUpdate
} from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

export class Chat implements Partial<TelegramChat> {
  id = 234
  type = 'private'
}

export class Message implements Partial<TelegramMessage> {
  text?: string
  message_id = 1
  date: 123456789
  chat = new Chat()
}

export default class TelegramContextMock implements Partial<ContextMessageUpdate> {

  update = <Update>{
    message: <Message>{}
  }

  from = <User>{}

  message: Message

  reply(text: string, extra?: ExtraReplyMessage): Promise<Message> {
    return new Promise((resolve, reject) => {
      this.message = new Message()
      this.message.text = text
      resolve(this.message)
    })
  }
}
