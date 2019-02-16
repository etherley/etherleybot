require('module-alias/register')
require('dotenv').config()

const Vault = artifacts.require('Vault')
const Wallet = require('@eth/wallet.eth').default
const Web3Provider = require('@eth/web3.eth').default
const VaultContract = require('@contract/VaultContract').default

const _UID = 639642123
const _alias = 'my-wallet_alias'

const wallet = new Wallet()
const vault = new VaultContract()
const web3 = new Web3Provider();

wallet.generateRandom()
// const UID = web3.utils.toHex(_UID)
// const alias = web3.utils.toHex(_alias)
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

  // it('should encrypt a random wallet, make it bytes32<>hex and decrypt it again', async () => {
  //   try {
  //     await Promise.all([
  //       vault.encrypt(wallet.mnemonic, 'mnemonic'),
  //       vault.encrypt(wallet.privateKey, 'privateKey'),
  //     ])
  //     await Promise.all([
  //       vault.decrypt(Buffer.from(vault.encrypted.mnemonic, 'hex'), 'mnemonic'),
  //       vault.decrypt(Buffer.from(vault.encrypted.privateKey, 'hex'), 'privateKey'),
  //     ])
  //     assert.equal(vault.decrypted.mnemonic, wallet.mnemonic)
  //     assert.equal(vault.decrypted.privateKey, wallet.privateKey)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // })

  it('should store an encrypted mnemonic and privateKey in the Vault Wallet struct', async () => {
    const contract = await Vault.deployed()
    await contract.storeWallet(
      _UID,
      address,
      _alias,
      vault.encrypted.mnemonic,
      vault.encrypted.privateKey,
      {
        from: wallet1
      }
    )
    const {
      alias,
      mnemonic,
      privateKey
    } = await contract.getWallet(
      _UID,
      address
    )
    console.log(w)
    assert.equal(_alias, alias)
    assert.equal(vault.encrypted.mnemonic, mnemonic)
    assert.equal(vault.encrypted.privateKey, privateKey)
  })
})
