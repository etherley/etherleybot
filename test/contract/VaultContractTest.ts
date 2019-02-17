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

const u1 = {
  ID: 539642123,
  wallet1: {
    vault: new VaultContract(),
    instance: (new Wallet()).generateRandom(),
    alias: 'u1-wallet1-alias'
  },
  wallet2: {
    vault: new VaultContract(),
    instance: (new Wallet()).generateRandom(),
    alias: 'u1-wallet2-alias'
  },
}

const u2 = {
  ID: 739642123,
  wallet1: {
    vault: new VaultContract(),
    instance: (new Wallet()).generateRandom(),
    alias: 'u2-wallet1-alias'
  },
  wallet2: {
    vault: new VaultContract(),
    instance: (new Wallet()).generateRandom(),
    alias: 'u2-wallet2-alias'
  },
}

const u3 = {
  ID: 839642123,
  wallet1: {
    vault: new VaultContract(),
    instance: (new Wallet()).generateRandom(),
    alias: 'u3-wallet1-alias'
  },
  wallet2: {
    vault: new VaultContract(),
    instance: (new Wallet()).generateRandom(),
    alias: 'u3-wallet2-alias'
  },
}

const test = async (user, from) => {
  const contract = await Vault.deployed()

  await Promise.all([
    user.wallet1.vault.encrypt(user.wallet1.instance.mnemonic, 'mnemonic'),
    user.wallet1.vault.encrypt(user.wallet1.instance.privateKey, 'privateKey'),
    user.wallet2.vault.encrypt(user.wallet2.instance.mnemonic, 'mnemonic'),
    user.wallet2.vault.encrypt(user.wallet2.instance.privateKey, 'privateKey'),
  ])

  await contract.storeWallet(
    user.ID,
    user.wallet1.instance.address.toString(),
    user.wallet1.alias,
    user.wallet1.vault.encrypted.mnemonic,
    user.wallet1.vault.encrypted.privateKey,
    {
      from: from
    }
  )

  await contract.storeWallet(
    user.ID,
    user.wallet2.instance.address.toString(),
    user.wallet2.alias,
    user.wallet2.vault.encrypted.mnemonic,
    user.wallet2.vault.encrypted.privateKey,
    {
      from: from
    }
  )

  const [
    address1,
    address2,
  ] = await contract.getWalletsByUserID(user.ID)

  assert.equal(address1, user.wallet1.instance.address.toString())
  assert.equal(address2, user.wallet2.instance.address.toString())

  const {
    _alias: alias1,
    mnemonic: mnemonic1,
    privateKey: privateKey1,
  } = await contract.getWallet(
    user.ID,
    address1
  )

  const {
    _alias: alias2,
    mnemonic: mnemonic2,
    privateKey: privateKey2,
  } = await contract.getWallet(
    user.ID,
    address2
  )

  await Promise.all([
    user.wallet1.vault.decrypt(Buffer.from(mnemonic1, 'hex'), 'mnemonic'),
    user.wallet1.vault.decrypt(Buffer.from(privateKey1, 'hex'), 'privateKey'),
    user.wallet2.vault.decrypt(Buffer.from(mnemonic2, 'hex'), 'mnemonic'),
    user.wallet2.vault.decrypt(Buffer.from(privateKey2, 'hex'), 'privateKey'),
  ])

  assert.equal(alias1, user.wallet1.alias)
  assert.equal(alias2, user.wallet2.alias)
  assert.equal(user.wallet1.vault.decrypted.mnemonic, user.wallet1.instance.mnemonic.toString())
  assert.equal(user.wallet1.vault.decrypted.privateKey, user.wallet1.instance.privateKey.toString())
  assert.equal(user.wallet2.vault.decrypted.mnemonic, user.wallet2.instance.mnemonic.toString())
  assert.equal(user.wallet2.vault.decrypted.privateKey, user.wallet2.instance.privateKey.toString())
}

contract('Vault Contract Test', async ([wallet1]) => {
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

  it(`should create, encrypt, store, retrieve and decrypt new wallets for USER ${u1.ID}`, test(u1, wallet1))
  it(`should create, encrypt, store, retrieve and decrypt new wallets for USER ${u2.ID}`, test(u2, wallet1))
  it(`should create, encrypt, store, retrieve and decrypt new wallets for USER ${u3.ID}`, test(u3, wallet1))
})
