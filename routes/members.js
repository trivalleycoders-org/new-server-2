import express from 'express'
// import connection from '../db'
import mysql from 'promise-mysql'
const router = express.Router();

const connectConfig = {
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
}

// create
router.post('/', function(req, res) {
  let newMember = req.body.member;
  // make sure we're not passing a member_id into the INSERT query
  ('member_id' in newMember) && delete newMember.member_id;
  // the following "placeholder" syntax is explained here: https://www.w3resource.com/node.js/nodejs-mysql.php#Escaping_query
  let sql = "INSERT INTO members SET ?";
  mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
  }).then((conn) => {
    let result = conn.query(sql, newMember);
    conn.end()
    return result
  }).then((rows) => {
    console.log('rows', rows)
    res.send(rows)
  })
})

// read
router.get('/', function(req, res) {
  // console.log('connectConfig', connectConfig)
  let sql = "SELECT * FROM members WHERE active != 0";
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

// update (handles member information updates, active/inactive swtiching)
router.put('/:id', function(req, res) {
  let updatedMember = req.body.member;
  // make sure we never update an existing member's member_id
  ('member_id' in updatedMember) && delete updatedMember.member_id;
  // the following "placeholder" syntax is explained here: https://www.w3resource.com/node.js/nodejs-mysql.php#Escaping_query
  let sql = "UPDATE members SET ? WHERE member_id = ?";
  mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
  }).then((conn) => {
    let result = conn.query(sql, [updatedMember, req.params.id])
    conn.end()
    return result
  }).then((rows) => {
    console.log('rows', rows)
    res.send(rows)
  })
})

// delete
router.delete('/:id', function(req, res) {
  // the following "placeholder" syntax is explained here: https://www.w3resource.com/node.js/nodejs-mysql.php#Escaping_query
  let sql = "DELETE FROM members WHERE member_id = ?";
  mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
  }).then((conn) => {
    let result = conn.query(sql, req.params.id)
    conn.end()
    return result
  }).then((rows) => {
    console.log('rows', rows)
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
