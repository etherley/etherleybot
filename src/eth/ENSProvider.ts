import { Contract } from 'web3-eth-contract';
import ENSRegistryContract from '@contract/ENSRegistry.contract';
import * as namehash from 'eth-ens-namehash';
import ENSResolverContract from '@contract/ENSResolver.contract';
import { Address } from '@eth/address.eth';
import Web3Provider from '@eth/web3.eth';

export class ENSProvider {

  web3: Web3Provider = new Web3Provider()
  instance: Contract
  registry: ENSRegistryContract

  constructor() {
    this.registry = new ENSRegistryContract()
    this.registry.connect()
  }

  lookup(name: string): Promise<Address> {
    console.log(`[ENSProvider] ENS searching for [${name}] resolver`)
    const address = new Address(this.web3)

    return new Promise((resolve, reject) => {
      const node = namehash.hash(name)
      this.registry.contract.methods.resolver(node).call().then(_resolver => {
        address.setAddress(_resolver)
        if (address.isValid()) {
          const resolver = new ENSResolverContract()
          resolver.connect(address)
          resolver.contract.methods.addr(node).call().then(addr => {
            address.address = addr['0']
            resolve(address)
          })
        } else {
          reject(new Error(`ENS "${name}" has no resolver`))
        }
      })
    })
  }

  owner(name: string): Promise<Address> {
    console.log(`[ENSProvider] ENS searching for [${name}] owner`)
    const address = new Address(this.web3)

    return new Promise((resolve, reject) => {
      const node = namehash.hash(name)
      this.registry.contract.methods.owner(node).call().then(_owner => {
        address.setAddress(_owner)
        if (address.isValid()) {
          resolve(address)
        } else {
          reject(new Error(`ENS "${name}" has no owner`))
        }
      })
    })
  }
}
