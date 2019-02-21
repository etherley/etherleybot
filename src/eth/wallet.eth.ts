import { ethers } from 'ethers';

export default class Wallet {

  instance: ethers.Wallet

  constructor() {
    console.info(`[Wallet] instantiating wallet class`)
  }

  generateRandom() {
    console.info(`[Wallet] Generating random wallet`)
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
