import {
  Update,
  Message as TelegramMessage,
  User,
  Chat as TelegramChat,
  PhotoSize
} from 'telegram-typings';

import {
  ContextMessageUpdate
} from 'telegraf';

import {
  ExtraReplyMessage,
  Document as TelegramDocument,
  MessageDocument as TelegramMessageDocument,
  MessagePhoto as TelegramMessagePhoto,
  InputFile,
  ExtraDocument,
  ExtraPhoto
} from 'telegraf/typings/telegram-types';

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

export class Document implements Partial<TelegramDocument> {
  file_id: string
}

export class Photo implements Partial<PhotoSize> {
  file_id: string
  width: number
  height: number
}

export class MessageDocument extends Message implements Partial<TelegramMessageDocument> {
  document: Document
}

export class MessagePhoto extends Message implements Partial<TelegramMessagePhoto> {
  photo: Photo[]
}

export default class TelegramContextMock implements Partial<ContextMessageUpdate> {

  update = <Update>{
    message: <Message>{}
  }

  from = <User>{}

  message: Message

  messageDocument: MessageDocument

  messagePhoto: MessagePhoto

  reply(text: string, extra?: ExtraReplyMessage): Promise<Message> {
    return new Promise((resolve, reject) => {
      this.message = new Message()
      this.message.text = text
      resolve(this.message)
    })
  }

  replyWithDocument(document: InputFile, extra?: ExtraDocument): Promise<MessageDocument> {
    return new Promise((resolve, reject) => {
      const doc = new MessageDocument()
      doc.document = new Document()
      doc.document.file_id = '123'
      this.messageDocument = doc
      resolve(doc)
    })
  }

  replyWithPhoto(document: InputFile, extra?: ExtraPhoto): Promise<MessagePhoto> {
    return new Promise((resolve, reject) => {
      const photo = new MessagePhoto()
      photo.photo = [new Photo()]
      photo.photo[0].file_id = '123'
      this.messagePhoto = photo
      resolve(photo)
    })
  }
}
