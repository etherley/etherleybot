import Crypto from 'crypto';

export default class Cypher {

  static algorithm = 'aes-256-cbc'

  encrypt(data: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const cipher = Crypto.createCipheriv(Cypher.algorithm, process.env.CYPHER_KEY, process.env.CYPHER_IV)
        resolve(Buffer.concat([
          cipher.update(data),
          cipher.final()
        ]))
      } catch (exception) {
        reject(exception)
      }
    })
  }

  decrypt(data: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const cipher = Crypto.createDecipheriv(Cypher.algorithm, process.env.CYPHER_KEY, process.env.CYPHER_IV)
        resolve(Buffer.concat([
          cipher.update(data),
          cipher.final()
        ]))
      } catch (exception) {
        reject(exception)
      }
    })
  }
}
