require('module-alias/register')
require('dotenv').config()

import app from './app';
import { EtherleyBot } from './bot';

const PORT = 3000
const BOT = new EtherleyBot(process.env.BOT_TOKEN)

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT)
    BOT.init()
})
