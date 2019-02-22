import { Address } from '@eth/address.eth';
import { ENSProvider } from '@eth/ENSProvider';
import { ContextMessageUpdate } from 'telegraf';

export class InlineQuery {

  query: string = undefined
  ctx: ContextMessageUpdate
  public ens: ENSProvider = new ENSProvider()

  constructor(ctx: any) {
    this.ctx = ctx
    this.query = this.ctx.inlineQuery.query
  }

  async reply() {
    let response;
    if (this.isENSAddress()) {
      console.log(`${this.query} is ENS Address`)
      try {
        const address: Address = await this.ens.lookup(this.query)
        response = this.makeENSResponse(address)
      } catch (address) {
        response = this.makeENSResponse(address)
      }
      this.ctx.telegram.answerInlineQuery(this.ctx.inlineQuery.id, response)
    }
  }

  isENSAddress(): boolean {
    console.log(this.query)
    const regex = new RegExp(/\.eth(?=\s+|$)/, 'is')
    return regex.test(this.query)
  }

  makeENSResponse(address: Address) {
    if (address.isValid()) {
      return [
        {
          type: 'document',
          id: '123',
          title: `ENS for ${this.query}`,
          document_url: 'https://www.dropbox.com/s/mvehkok2b0lss5j/D-T%2BWHITE%2BPAPER.pdf',
          mime_type: 'application/pdf',
          description: `Found: ${address.toChecksumAddress()}`,
          reply_markup: {
            inline_keyboard: [
              [{
                text: 'See on etherscan.io',
                url: `https://etherscan.io/address/${this.query}`,
              }]
            ],
          },
          input_message_content: {
            message_text: `${this.query} resolves to ${address.toChecksumAddress()}`,
            disable_web_page_preview: true,
          }
        }
      ]
    }
    return [
      {
        type: 'document',
        id: '123',
        title: `ENS for ${this.query}`,
        document_url: 'https://www.dropbox.com/s/mvehkok2b0lss5j/D-T%2BWHITE%2BPAPER.pdf',
        mime_type: 'application/pdf',
        description: `Not Found 🙃`,
        reply_markup: {
          inline_keyboard: [
            [{
              text: 'Make it yours!',
              url: `https://ens.domains/`,
            }]
          ],
        },
        input_message_content: {
          message_text: `ENS address ${this.query} has no ETH address`,
          disable_web_page_preview: true,
        }
      }
    ]
  }

}
