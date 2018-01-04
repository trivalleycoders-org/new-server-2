import SourceMapSupport from 'source-map-support';
SourceMapSupport.install();
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import { db } from './db'
// import member from './routes/members'
import members from './routes/members'
import schedule from './routes/schedule'
import roles from './routes/roles'
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
app.use('/roles', roles)

// error handler
// app.use((err, req, res, next) => {
//   console.log('** error **')
//   // set locals, only providing error in development
//   // res.locals.message = err.message;
//   // res.locals.error = req.app.get('env') === 'development'
//   //   ? err
//   //   : {};
//   //
//   // // render the error page
//   // res.status(err.status || 500);
//   res.status(500).send('error');
// });


app.set('port', (process.env.PORT || 3001))
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})
