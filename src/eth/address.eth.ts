
export class Address {

    static readonly empty = '0x0000000000000000000000000000000000000000'

    address = Address.empty
    name: string
    web3: any

    constructor(web3: any, address?: string) {
        this.web3 = web3
        this.setAddress(address)
    }

    isENSAddress(_name?: string): boolean {
        const name = _name ? _name : this.name
        const regex = new RegExp(/\.eth(?=\s+|$)/, 'is')
        return regex.test(name)
    }

    setAddress(address: string) {
        if (this.isValid(address)) {
            this.address = address
        }
        return this
    }

    setName(name: string) {
        if (this.isENSAddress(name)) {
            this.name = name
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
