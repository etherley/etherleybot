import Web3 from 'web3';
import { ENSRegistryContract } from '@contract/ENSRegistry.contract';
import * as namehash from 'eth-ens-namehash';
import { ENSResolverContract } from '@contract/ENSResolver.contract';
import { Address } from '@eth/address.eth';

export class ENSProvider {

    web3: any
    instance: any
    registry: ENSRegistryContract

    constructor() {
        const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/3ffb5509990b4964acd6de7991d5750d')
        this.web3 = new Web3(provider)
        this.registry = new ENSRegistryContract(this.web3)
        this.registry.connect()
    }

    lookup(name: string): Promise<Address> {
        console.log(`ENS searching for [${name}]`)
        const address = new Address(this.web3)

        return new Promise((resolve, reject) => {
            const node = namehash.hash(name)
            this.registry.instance.methods.resolver(node).call().then(_resolver => {
                address.setAddress(_resolver)
                if (address.isValid()) {
                    const resolver = new ENSResolverContract(this.web3)
                    resolver.connect(address.toChecksumAddress())
                    resolver.instance.methods.addr(node).call().then(addr => {
                        console.log(addr)
                        address.address = addr['0']
                        resolve(address)
                    })
                } else {
                    console.log(`NO RESOLVER for [${name}]`)
                    reject(address)
                }
            })
        })
    }

}
