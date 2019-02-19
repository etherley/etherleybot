import Web3 from 'web3';
import { Utils } from 'web3-utils';
import { Eth } from 'web3-eth';

export interface Network {
  mainnet: string,
  ropsten: string,
  local: string,
}
export default class Web3Provider {

  utils: Utils
  eth: Eth
  instance: Web3

  constructor(network: string = process.env.ETHEREUM_NETWORK) {
    const provider = new Web3.providers.HttpProvider(network)
    this.instance = new Web3(provider)
    this.utils = this.instance.utils
    this.eth = this.instance.eth
  }
}
