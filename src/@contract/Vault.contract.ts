import { ethers } from 'ethers';
import Cypher from '@lib/cypher.lib';
import { Web3Provider } from '@eth/web3.eth';

interface IWalletStruct {
  mnemonic: string,
  privateKey: string,
  alias: string,
  address: string,
}

export default class VaultContract {

  instance: ethers.Wallet | any
  current: Buffer
  field: string
  hex: string
  web3: Web3Provider = new Web3Provider()

  encrypted = <IWalletStruct>{}
  decrypted = <IWalletStruct>{}

  constructor() { }

  prepare(value: Buffer, field: keyof IWalletStruct) {
    this.current = value
    this.field = field
    return this
  }

  encrypt(data: Buffer, field: keyof IWalletStruct): Promise<void> {
    const cypher = new Cypher()
    return new Promise((resolve, reject) => {
      cypher.encrypt(data).then(encrypted => {
        // this.wallet[field] = this.web3.utils.toHex(encrypted.toString('hex'))
        this.encrypted[field] = encrypted.toString('hex')
        resolve()
      }).catch(error => {
        console.error(error)
        reject(error)
      })
    })
  }

  decrypt(data: Buffer, field: keyof IWalletStruct): Promise<void> {
    const cypher = new Cypher()
    return new Promise((resolve, reject) => {
      cypher.decrypt(data).then(decrypted => {
        this.decrypted[field] = decrypted.toString('utf8')
        resolve()
      }).catch(error => {
        console.error(error)
        reject(error)
      })
    })
  }

  toBuffer(): Buffer {
    return Buffer.from(JSON.stringify(this.instance))
  }
}
