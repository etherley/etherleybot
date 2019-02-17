require('module-alias/register')
require('dotenv').config()

const Vault = artifacts.require('Vault')
const Wallet = require('@eth/wallet.eth').default
const Web3Provider = require('@eth/web3.eth').default
const VaultContract = require('@contract/VaultContract').default

const _UID = 639642123
const ALIAS = 'my-wallet_alias'

let wallet = new Wallet()
let vault = new VaultContract()
let web3 = new Web3Provider()

wallet.generateRandom()
const address = wallet.address.toString()

contract('Vault Contract Test', async ([wallet1, wallet2, wallet3]) => {
  it('should encrypt a random wallet mnemonic and privateKey', async () => {
    try {
      await Promise.all([
        vault.encrypt(wallet.mnemonic, 'mnemonic'),
        vault.encrypt(wallet.privateKey, 'privateKey'),
      ])
      await Promise.all([
        vault.decrypt(Buffer.from(vault.encrypted.mnemonic, 'hex'), 'mnemonic'),
        vault.decrypt(Buffer.from(vault.encrypted.privateKey, 'hex'), 'privateKey'),
      ])
      assert.equal(vault.decrypted.mnemonic, wallet.mnemonic)
      assert.equal(vault.decrypted.privateKey, wallet.privateKey)
    } catch (error) {
      console.error(error)
    }
  })

  it('should store an encrypted mnemonic and privateKey in the Vault Wallet struct', async () => {
    const contract = await Vault.deployed()
    await contract.storeWallet(
      _UID,
      address,
      ALIAS,
      vault.encrypted.mnemonic,
      vault.encrypted.privateKey,
      {
        from: wallet1
      }
    )
    const {
      _alias,
      mnemonic,
      privateKey
    } = await contract.getWallet(
      _UID,
      address
    )
    assert.equal(ALIAS, _alias)
    assert.equal(vault.encrypted.mnemonic, mnemonic)
    assert.equal(vault.encrypted.privateKey, privateKey)
  })

  it('should retrieve a Wallet by UID and address and decrypt the mnemonic and privateKey', async () => {
    const contract = await Vault.deployed()
    const {
      mnemonic,
      privateKey
    } = await contract.getWallet(
      _UID,
      address
    )

    vault = new VaultContract()

    await Promise.all([
      vault.decrypt(Buffer.from(mnemonic, 'hex'), 'mnemonic'),
      vault.decrypt(Buffer.from(privateKey, 'hex'), 'privateKey'),
    ])
    assert.equal(vault.decrypted.mnemonic, wallet.mnemonic)
    assert.equal(vault.decrypted.privateKey, wallet.privateKey)
  })

  it('should get the UID wallet addresses', async () => {
    const contract = await Vault.deployed()
    const [
      address1
    ] = await contract.getWalletsByUserID(_UID)

    assert.equal(address1, wallet.address.toString())
  })
})
