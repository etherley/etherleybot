import { ethers } from 'ethers';

export default class Wallet {

  instance: ethers.Wallet

  constructor() { }

  generateRandom() {
    this.instance = ethers.Wallet.createRandom()
    return this
  }

  toBuffer(): Buffer {
    return Buffer.from(JSON.stringify(this.instance))
  }
}
