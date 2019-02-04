export class InlineQuery {

    query: string = undefined
    ctx: any

    constructor(query: string, ctx: any) {
        this.query = query
        this.ctx = ctx
    }

    isENSAddress(): boolean {
        console.log(this.query)
        const regex = new RegExp(/\.eth(?=\s+|$)/, 'is')
        return regex.test(this.query)
    }

    makeENSResponse() {
        this.ctx.telegram.answerInlineQuery(this.ctx.inlineQuery.id, [
            {
                type: 'document',
                id: '123',
                title: `ENS for ${this.query}`,
                document_url: 'https://www.dropbox.com/s/mvehkok2b0lss5j/D-T%2BWHITE%2BPAPER.pdf',
                mime_type: 'application/pdf',
                description: `Found: 123`,
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'etherscan.io',
                            url: 'https://etherscan.io/address/0x24b2e8c86cc5a378b184b64728db1a8484d844ec',
                        }]
                    ],
                },
                input_message_content: {
                    message_text: 'This is a text instead of file',
                    disable_web_page_preview: true,
                }
            }
        ])
    }

}
