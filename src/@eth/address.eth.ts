
export class Address {

    static readonly empty = '0x0000000000000000000000000000000000000000'

    address = Address.empty
    web3: any

    constructor(web3: any, address?: string) {
        this.web3 = web3
        this.setAddress(address)
    }

    setAddress(address: string) {
        if (this.isValid(address)) {
            this.address = address
        }
        return this
    }

    toString() {
        return this.address
    }

    isValid(_address?: string) {
        const address = _address ? _address : this.toString()
        return address !== '0x0000000000000000000000000000000000000000' &&
            this.web3.utils.isAddress(address)
    }

    toUpperCase() {
        return this.address.toUpperCase()
    }

    toChecksumAddress(): string {
        return this.isValid() ? this.web3.utils.toChecksumAddress(this.address) : ''
    }
}
