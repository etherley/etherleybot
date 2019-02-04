const ENSRegistryInterface = require('@abi/ENSRegistry.json')

export class ENSRegistryContract {

    bytecode = ENSRegistryInterface.bytecode
    address: string
    web3: any
    instance: any

    constructor(web3: any) {
        this.web3 = web3
    }

    // connect() {
    //     const contract = new this.web3.eth.Contract(ENSRegistryInterface.abi, {
    //         data: ENSRegistryInterface.bytecode,
    //     })
    //     this.instance = contract
    //     this.instance._address = '0x314159265dD8dbb310642f98f50C066173C1259b'
    //     return this
    // }
}
