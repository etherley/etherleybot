import Wallet from '@eth/wallet.eth';
import VaultContract from '@contract/Vault.contract';

export default class VaultContractTest {

  constructor() {
    console.info(`[TEST] VaultContractTest`)
  }

  run() {
    const wallet = new Wallet()
    const vault = new VaultContract()
    wallet.generateRandom()
    Promise.all([
      vault.encrypt(wallet.mnemonic, 'mnemonic'),
      vault.encrypt(wallet.privateKey, 'privateKey'),
    ]).then(r => {
      console.log(vault.encrypted)
      console.log(`\n`)
      Promise.all([
        vault.decrypt(Buffer.from(vault.encrypted.mnemonic, 'hex'), 'mnemonic'),
        vault.decrypt(Buffer.from(vault.encrypted.privateKey, 'hex'), 'privateKey'),
      ]).then(() => {
        console.log(vault.decrypted)
        console.log(`\n`)
      }).catch(error => {
        console.error(error)
      })
    }).catch(error => {
      console.error(error)
    })
  }

}
