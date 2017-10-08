import express from 'express'
import mysql from 'promise-mysql'
const router = express.Router();

router.get('/next6', function(req, res) {
  let sql = 'select h.history_id, h.date, h.member_id, h.role_id, h.served, m.first_name, r.role_name '
  sql += 'from history as h, members as m, roles as r '
  sql += 'where h.member_id = m.member_id and h.role_id = r.role_id and m.exempt <> 1 '
  sql += 'order by date desc '
  sql += 'limit 6;'
  console.log('/next6: sql', sql)
  // mysql.createConnection({
  //     host     : process.env.DB_HOST,
  //     user     : process.env.DB_USER,
  //     password : process.env.DB_PASS,
  //     database : process.env.DB_NAME
  // }).then((conn) => {
  //   let result = conn.query(sql)
  //   conn.end()
  //   return result
  // }).then((rows) => {
  //   console.log('rows', rows)
  //   res.send(rows)
  // })
})

module.exports = router;
