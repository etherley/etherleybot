import Web3 from 'web3';

export class Web3Provider {

  utils: any
  instance: Web3

  constructor() {
    const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/3ffb5509990b4964acd6de7991d5750d')
    this.instance = new Web3(provider)
    this.utils = this.instance.utils
  }
}
