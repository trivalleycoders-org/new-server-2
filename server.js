import SourceMapSupport from 'source-map-support';
SourceMapSupport.install();
import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'
import { db } from './db'
import route01 from './routes/route01'
import route02 from './routes/route02'

const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/route01', route01)
app.use('/route02', route02)

app.set('port', (process.env.PORT || 3001))
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})
