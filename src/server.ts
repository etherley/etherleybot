require('module-alias/register')
require('dotenv').config()

import Web3 from 'web3';
import app from './app';
import EtherleyBot from './bot';
import bodyParser = require('body-parser');
import Wallet from '@eth/wallet.eth';
import Cypher from '@lib/cypher.lib';
import { namehash } from 'ethers/utils';
import VaultContract from '@contract/Vault.contract';

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'dev') {
  app.post('/dev', function (req, res) {
    const body = req.body
    console.log(req.body)

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
        res.sendStatus(200)
      }).catch(error => {
        console.error(error)
        res.sendStatus(500)
      })
    }).catch(error => {
      console.error(error)
      res.sendStatus(500)
    })
  })

  app.listen(process.env.PORT, () => {
    console.log('[ENV] dev')
    console.log(`Express server listening on port ${process.env.PORT}`)
    console.log(`\n\n`)
  })
} else {
  const BOT = new EtherleyBot(process.env.BOT_TOKEN)
  BOT.stop()
  BOT.init()

  app.post('/stripe', function (req, res) {
    const body = req.body
    if (body && body.type) {
      if (body.type === 'charge.succeeded') {
        console.log('// TODO transfer to bank account, or do somethin with the $$')
      }
    }
    console.log(req.body)
    res.sendStatus(200)
  })

  app.listen(process.env.PORT, () => {
    console.log(`Express server listening on port ${process.env.PORT}`)
    BOT.launch()
  })
}
