import express from 'express'
import mysql from 'promise-mysql'
const router = express.Router();

router.get('/scheduleMembers', function(req, res) {
  // let sql = 'select (@row:=@row+1) as sequence, h.history_id, h.date, h.member_id, h.role_id, h.served, m.first_name, r.role_name '
  // sql += 'from history as h, members as m, roles as r, (select @row := 0) s '
  // sql += 'where h.member_id = m.member_id and h.role_id = r.role_id and m.exempt <> 1 '
  // sql += 'order by date desc '
  // sql += 'limit 12;'

  let sql = `
    SELECT (select (@row:=@row+1) FROM (select @row := 0) s) as sequence, m.member_id, m.first_name, m.last_name, h.history_id, h.date, h.role_id, r.role_name, m.comment
    FROM members m
    LEFT JOIN history h ON h.member_id = m.member_id AND (h.date = (SELECT MAX(h1.date) FROM history h1 WHERE h1.member_id = m.member_id))
    LEFT JOIN roles r on r.role_id = h.role_id
    WHERE m.exempt = 0
    ORDER BY (h.history_id IS NULL) DESC, h.date ASC, m.last_name ASC
    LIMIT 12;
  `
  // console.log('/next6: sql', sql)
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
    console.log('routes.schedule/next6: rows \n', rows)
    res.send(rows)
  })
})

router.get('/roles', function(req, res) {
  let sql = 'select * from roles'
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
    console.log('routes.schedule/roles: rows \n', rows)
    res.send(rows)
  })
})

router.get('/exclusions', function(req, res) {
  let sql = 'select * from exclusions'
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
    console.log('routes.schedule/exclusions: rows \n', rows)
    res.send(rows)
  })
})

module.exports = router;
