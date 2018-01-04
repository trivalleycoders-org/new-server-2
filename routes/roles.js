import express from 'express'
import mysql from 'promise-mysql'

const router = express.Router();

router.get('/', function(req, res) {
  let sql = 'SELECT role_id AS id, role_name AS name FROM roles'
  // console.log('/roles: sql', sql)
  mysql.createConnection(connectionConfig).then((conn) => {
    let result = conn.query(sql)
    conn.end()
    return result
  }).then((rows) => {
    // console.log('routes.schedule/roles: rows \n', rows)
    res.send(rows)
  })
})

module.exports = router;
