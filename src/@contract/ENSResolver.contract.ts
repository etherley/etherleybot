import * as ENSResolver from '@abi/PublicResolver.json';

export class ENSResolverContract {

    bytecode = ENSResolver.bytecode
    address: string
    web3: any
    instance: any

    constructor(web3: any) {
        this.web3 = web3
    }

    connect(address: string) {
        const contract = new this.web3.eth.Contract(ENSResolver.abi,
            address,
            {
                data: ENSResolver.bytecode,
            })
        this.instance = contract
        return this
    }
}
