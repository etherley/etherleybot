import { Address } from '@eth/address.eth';
import { ENSProvider } from '@eth/ens.eth';
import jsonfile from 'jsonfile';
import * as fs from 'fs';
import { ethers } from 'ethers';

export class NewCommand {

    ctx: any
    ens: ENSProvider = new ENSProvider()

    constructor(ctx) {
        this.ctx = ctx
    }

    reply() {
        const text = this.ctx.update.message.text
        const regex = new RegExp(/wallet/, 'gi')
        if (regex.test(text)) {
            this.generateNewWallet()
        } else {
            this.ctx.reply(`/New what?`, {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: '/new wallet',
                            },
                            {
                                text: '/new erc20',
                            },
                            {
                                text: '/new ICO',
                            },
                            {
                                text: '/new relationship',
                            },
                        ],
                    ],
                }
            })
        }

    }

    async generateNewWallet() {
        const wallet: ethers.Wallet = ethers.Wallet.createRandom()
        const address = await wallet.getAddress()

        const file = `/tmp/${address}.json`

        jsonfile.writeFile(file, wallet).then(() => {
            jsonfile.readFile(file).then(_obj => {

                this.ctx.reply(`This is a fresh Ethereum wallet.\n\nI WILL NOT STORE THIS FOR YOU, you must download it and store it somewhere that only you know:`)
                this.ctx.replyWithDocument({ source: file })

            }).catch(err => console.log(err))

            setTimeout(() => {
                fs.unlink(file, (err) => {
                    if (err) { console.log(err) }
                })
            }, 10000)

        }).catch(err => console.log(err))
    }

}
