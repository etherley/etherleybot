import Cypher from '@lib/cypher.lib';
import Web3Provider from '@eth/web3.eth';
import * as VaultInterface from '@abi/Vault.json';
import { AbiItem } from 'web3-utils/types';
import { ContractOptions } from 'web3-eth-contract/types';

export interface IWalletStruct {
  _alias: string,
  _address: string,
  mnemonic: string,
  privateKey: string,
}

export default class VaultContract {

  static readonly address = '0x9560c1cD6C7Bb68Dcf131586d10c7Bb08B70ae87'

  contract: any
  field: string

  web3: Web3Provider = new Web3Provider()

  encrypted = <IWalletStruct>{}
  decrypted = <IWalletStruct>{}

  constructor() { }

  connect() {
    this.contract = new this.web3.eth.Contract(
      VaultInterface.abi as AbiItem[],
      VaultContract.address,
      {
        data: VaultInterface.bytecode,
      } as ContractOptions
    )
    return this
  }

  getWalletAddressesByUserID(UID): Promise<any> {
    return this.contract.methods.getWalletAddressesByUserID(UID).call({
      from: process.env.BOT_ADDRESS
    })
  }

  getWallet(UID: number, address: string): Promise<IWalletStruct> {
    return this.contract.methods.getWallet(UID, address).call({
      from: process.env.BOT_ADDRESS
    })
  }

  storeWallet(UID: number, address: string, alias: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const txObject = await this.contract.methods.storeWallet(
          UID,
          address,
          alias,
          this.encrypted.mnemonic,
          this.encrypted.privateKey,
        )
        const gas = await txObject.estimateGas()
        const txOptions = {
          from: process.env.BOT_ADDRESS,
          to: this.contract.options.address,
          value: '0x0',
          gas: gas,
          data: txObject.encodeABI(),
        }
        const signedTx = await this.web3.eth.accounts.signTransaction(txOptions, process.env.BOT_PRIVATE_KEY)
        const tx = this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        tx.on('error', error => {
          reject(error)
        })
        tx.on('receipt', receipt => {
          resolve(receipt)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  encrypt(data: Buffer, field: keyof IWalletStruct): Promise<void> {
    const cypher = new Cypher()
    return new Promise((resolve, reject) => {
      cypher.encrypt(data).then(encrypted => {
        // this.wallet[field] = this.web3.utils.toHex(encrypted.toString('hex'))
        this.encrypted[field] = encrypted.toString('hex')
        resolve()
      }).catch(error => {
        console.error(error)
        reject(error)
      })
    })
  }

  decrypt(data: Buffer, field: keyof IWalletStruct): Promise<void> {
    const cypher = new Cypher()
    return new Promise((resolve, reject) => {
      cypher.decrypt(data).then(decrypted => {
        this.decrypted[field] = decrypted.toString('utf8')
        resolve()
      }).catch(error => {
        console.error(error)
        reject(error)
      })
    })
  }
}
