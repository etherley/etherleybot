import { ethers } from 'ethers';

export default class Wallet {

  instance: ethers.Wallet

  constructor() { }

  generateRandom() {
    this.instance = ethers.Wallet.createRandom()
    return this
  }

  get mnemonic(): Buffer {
    return Buffer.from(this.instance.mnemonic)
  }

  get privateKey(): Buffer {
    return Buffer.from(this.instance.privateKey)
  }

  get address(): Buffer {
    return Buffer.from(this.instance.address)
  }

  toBuffer(): Buffer {
    return Buffer.from(JSON.stringify(this.instance))
  }
}
