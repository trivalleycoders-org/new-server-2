import express from 'express'
// import connection from '../db'
import mysql from 'promise-mysql'
const router = express.Router();

router.get('/', function(req, res) {
  let sql = "SELECT * FROM members";
  mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'karl',
    database : 'rotary_test'
  }).then((conn) => {
    let result = conn.query(sql)
    conn.end()
    return result
  }).then((rows) => {
    console.log('rows', rows)
    res.send(rows)
  })
})

router.put('/:id', function(req, res) {
  // console.log('members/email')
  // console.log('id', req.params.id)
  // console.log('email', req.body.email)
  let _id = req.params.id
  let newEmail = req.body.email
  let sql = `UPDATE members SET email = '${newEmail}' WHERE members._id = ${_id}`
  console.log('sql', sql)
  connection.query(sql, function(err, rows, fields) {
    if (err) throw err

    console.log('rows', rows)
    res.send('sent query')
  })
})

router.get('/hello', function(req, res) {
  res.send('Hello again from route II');
});

router.get('/users', function(req, res) {
  res.send('List of  users.');
});

module.exports = router;
