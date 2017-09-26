import express from 'express'
// import connection from '../db'
import mysql from 'promise-mysql'
const router = express.Router();

router.get('/', function(req, res) {
  let sql = "SELECT * FROM members";
  mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
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
  let _id = req.params.id
  let newFirst = req.body.member.firstname
  let newLast = req.body.member.lastname
  let newEmail = req.body.member.email
  let sql = `UPDATE members SET firstname = '${newFirst}', lastname = '${newLast}', email = '${newEmail}' WHERE member_id = ${_id}`
  mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
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
  let id = req.params.id
  let email = req.body.email
  let sql = `UPDATE members SET email = '${email}' WHERE members.member_id = ${id}`
  console.log('put: sql', sql)
  connection.query(sql, function (err, rows, fields) {
    if (err) {
      console.log(err)
    }
    console.log(rows)
    res.send(rows)
  })
})

router.get('/hello', function(req, res) {
  res.send('Hello again from route II');
});

router.get('/users', function(req, res) {
  res.send('List of  users.');
});

module.exports = router;
