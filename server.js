import SourceMapSupport from 'source-map-support';
SourceMapSupport.install();
import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'
import { db } from './db'
// import member from './routes/members'
import members from './routes/members'
require('dotenv').config()

const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// app.use('/route01', route01)
app.use('/members', members)

app.set('port', (process.env.PORT || 3001))
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})
