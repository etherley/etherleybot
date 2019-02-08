require('module-alias/register')
require('dotenv').config()

import app from './app';
import { EtherleyBot } from './bot';
import bodyParser = require('body-parser');

const BOT = new EtherleyBot(process.env.BOT_TOKEN)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/stripe', function (req, res) {
  console.log(req.body)
  res.sendStatus(200)
})

app.listen(process.env.PORT, () => {
  console.log(`Express server listening on port ${process.env.PORT}`)
  BOT.init()
})

