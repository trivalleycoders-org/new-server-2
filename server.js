import SourceMapSupport from 'source-map-support';
SourceMapSupport.install();
import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'
import { db } from './db'
// import member from './routes/members'
import members from './routes/members'
import schedule from './routes/schedule'
require('dotenv').config()

const app = express()

global.connectionConfig = {
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
}



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// app.use('/route01', route01)
app.use('/members', members)
app.use('/schedule', schedule)

app.set('port', (process.env.PORT || 3001))
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})
