require('module-alias/register')
require('dotenv').config()

import app from './app';
import EtherleyBot from './bot';
import bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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
