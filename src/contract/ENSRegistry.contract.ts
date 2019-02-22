import * as ENSRegistryInterface from '@abi/ENSRegistry.json';
import { Contract } from 'web3-eth-contract';
import Web3Provider from '@eth/web3.eth';
import { ContractOptions } from 'web3-eth-contract/types';
import { AbiItem } from 'web3-utils/types';

export default class ENSRegistryContract {

  static readonly address = '0x314159265dD8dbb310642f98f50C066173C1259b'

  web3: Web3Provider = new Web3Provider()
  contract: Contract

  constructor() { }

  connect() {
    console.info(`[ENSRegistryContract] connecting to contract ABI at ${ENSRegistryContract.address} with network ${this.web3.network}`)
    this.contract = new this.web3.eth.Contract(
      ENSRegistryInterface.abi as AbiItem[],
      ENSRegistryContract.address,
      {
        data: ENSRegistryInterface.bytecode,
      } as ContractOptions
    )
    return this
  }
}
