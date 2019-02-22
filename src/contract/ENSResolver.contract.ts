import * as ENSResolverInterface from '@abi/PublicResolver.json';
import { Contract } from 'web3-eth-contract';
import Web3Provider from '@eth/web3.eth';
import { ContractOptions } from 'web3-eth-contract/types';
import { AbiItem } from 'web3-utils/types';
import { Address } from '@eth/address.eth';

export default class ENSResolverContract {

  static readonly address = '0x314159265dD8dbb310642f98f50C066173C1259b'

  address: string
  web3: Web3Provider = new Web3Provider()
  contract: Contract

  constructor() { }

  connect(address: Address) {
    console.info(`[ENSResolverContract] connecting to contract ABI at ${ENSResolverContract.address} with network ${this.web3.network}`)
    this.contract = new this.web3.eth.Contract(
      ENSResolverInterface.abi as AbiItem[],
      address.toChecksumAddress(),
      {
        data: ENSResolverInterface.bytecode,
      } as ContractOptions
    )
    return this
  }
}
