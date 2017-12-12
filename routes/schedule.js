import express from 'express'
import mysql from 'promise-mysql'
const router = express.Router();

// simple schedule -- roleId => memberId pairs
// if no date, use current date
// get the six that served on date supplied
// if no results, return the next six (by last served date)
router.get('/schedule/:date?', function(req, res, next) {
  let db

  let date = req.params.date;
  if (!date) {
      let currentDate = new Date()
      let currentDay = currentDate.getDate()
      if (currentDay < 10) currentDay = '0' + currentDay
      let currentMonth = currentDate.getMonth() + 1
      if (currentMonth < 10) currentMonth = '0' + currentMonth
      date = currentDate.getFullYear() + '-' + currentMonth + '-' + currentDay
  }

  let schedule = {}, membersByRole = {}
  let roleIds = [], unassignedRoleIds = [], scheduledMemberIds = []

  mysql.createConnection(connectionConfig).then((conn) => {
    db = conn
    // first get the roles
    let sql = "SELECT role_id FROM roles"
    let result = conn.query(sql)
    return result
  }).then((rows) => {
    for (let i = 0; i < rows.length; i++) {
      roleIds[i] = rows[i].role_id
    }
    console.log('roleIds:', roleIds)

    // see if there's an existing schedule
    let sql = "SELECT member_id AS memberId, role_id AS roleId, date FROM history WHERE date = '" + date + "'"
    let result = db.query(sql)
    return result
  }).then((rows) => {
    let rid
    for (let i = 0; i < rows.length; i++) {
      rid = rows[i]['roleId']
      membersByRole[rid] = rows[i]['memberId']
      scheduledMemberIds[i] = rows[i]['memberId']
    }
    for (let i = 0; i < roleIds.length; i++) {
      rid = roleIds[i]
      if (!membersByRole[rid]) {
        unassignedRoleIds.push(rid)
      }
    }
    console.log('existing schedule:', membersByRole)
    console.log('unassigned roles:', unassignedRoleIds)
    let result
    if (rows.length < roleIds.length) {
      // if there are fewer roles scheduled than there are existing roles,
      // fill in the schedule with the next eligible members (by last served date)
      let sql = `
        SELECT m.member_id
        FROM members m
        LEFT JOIN history h ON h.member_id = m.member_id AND (h.date = (SELECT MAX(h1.date) FROM history h1 WHERE h1.member_id = m.member_id))
        WHERE m.exempt = 0
        ORDER BY (h.history_id IS NULL) DESC, h.date ASC, m.last_name ASC
        LIMIT ${roleIds.length}
      `
      console.log('fill-in sql: ', sql)
      result = db.query(sql)
    } else {
      result = []
    }
    return result
  }).then((rows) => {
    db.end()
    let rid
    if (rows.length) {
      // loop over the unassigned roles
      for (let i = 0; i < unassignedRoleIds.length; i++) {
        // find a member not yet assigned to a role
        for (let j = 0; j < rows.length; j++) {
          if (scheduledMemberIds.indexOf(rows[j]['member_id']) < 0) {
            console.log('fill-in member ids:', rows)
            console.log('fill-in member id:', rows[i]['member_id'])
            rid = unassignedRoleIds[i]
            membersByRole[rid] = rows[i]['member_id']
            scheduledMemberIds.push(rows[i]['member_id'])
            break;            
          }
        }
      }
    }
    console.log('membersByRole:', membersByRole)
    res.send(membersByRole)
  })
})

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
  mysql.createConnection(connectionConfig).then((conn) => {
    let result = conn.query(sql)
    conn.end()
    return result
  }).then((rows) => {
    // console.log('routes.schedule/scheduleMembers: rows \n', rows)
    res.send(rows)
  })
})

router.get('/roles', function(req, res) {
  let sql = 'SELECT * FROM roles'
  mysql.createConnection(connectionConfig).then((conn) => {
    let result = conn.query(sql)
    conn.end()
    return result
  }).then((rows) => {
    // console.log('routes.schedule/roles: rows \n', rows)
    res.send(rows)
  })
})


// not needed with new members data structure
router.get('/exclusions', function(req, res) {
  let sql = 'select * from exclusions'
  mysql.createConnection(connectionConfig).then((conn) => {
    let result = conn.query(sql)
    conn.end()
    return result
  }).then((rows) => {
    // console.log('routes.schedule/exclusions: rows \n', rows)
    res.send(rows)
  })
})

module.exports = router;
