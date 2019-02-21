import Cypher from '@lib/cypher.lib';
import { Contract } from 'web3-eth-contract';
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

  static readonly address = '0xc5097df0ab6480c79e20b1fcb3b25d9ba3dcd595'

  contract: Contract

  web3: Web3Provider = new Web3Provider()

  encrypted = <IWalletStruct>{}
  decrypted = <IWalletStruct>{}

  constructor() { }

  connect() {
    console.info(`[VaultContract] connecting to contract ABI at ${VaultContract.address} with network ${this.web3.network}`)
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
    console.info(`[VaultContract] attempting to store encrypted wallet in Vault.sol contract instance. ${UID}, ${address}, ${alias}`)
    return new Promise(async (resolve, reject) => {
      try {
        const txObject = await this.contract.methods.storeWallet(
          UID,
          address,
          alias,
          this.encrypted.mnemonic,
          this.encrypted.privateKey,
        )
        const gas = await txObject.estimateGas({
          from: process.env.BOT_ADDRESS,
        })
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
    console.info(`[VaultContract] encrypting ${field}`)
    return new Promise((resolve, reject) => {
      cypher.encrypt(data).then(encrypted => {
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
    console.info(`[VaultContract] decrypting ${field}`)
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
