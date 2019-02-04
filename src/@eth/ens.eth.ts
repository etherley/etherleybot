import Web3 from 'web3';
import { ENSRegistryContract } from '@contract/ENSRegistry.contract';

export class ENSProvider {

    web3: any
    instance: any
    registry: ENSRegistryContract

    constructor() {
        const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/3ffb5509990b4964acd6de7991d5750d')
        // const provider = new Web3.providers.WebsocketProvider('ws://mainnet.infura.io/v3/3ffb5509990b4964acd6de7991d5750d')
        this.web3 = new Web3(provider)
        this.registry = new ENSRegistryContract(this.web3)
        console.log(this.registry)
        // this.registry.methods.
        // this.instance = new ENS(provider)
        // console.log(this.web3.eth.ens)
        // this.web3.eth.ens.resolver('superander.eth').then(contract => {
        // console.log(contract)
        // })

    }

    lookup(address: string) {
        console.log(`ENS searching for [${address}]`)
        // try {
        //     this.web3.eth.ens.getAddress(address).then((hex) => {
        //         console.log(hex);
        //     })
        // } catch (error) {
        //     console.error(error)
        // }
    }

}
