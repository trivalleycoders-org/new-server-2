import express from 'express'
import mysql from 'promise-mysql'

const router = express.Router();


// simple schedule -- roleId => memberId pairs
// if no date, use current date
// get the six that served on date supplied
// if no results, return the next six (by last served date)

const makeSchedule = (roles) => {
  let arr = []
  roles.forEach((role) => {
    let r = { roleId: role.roleId, roleName: role.roleName, memberId: '' }
    arr.push(r)
  })
  return arr
}

const fillExistingSchedule = (schedule, existingSchedule) => {
  schedule.forEach((role) => {
    let x = existingSchedule.filter((r) => {
      return r.roleId === role.roleId
    })
    if (x.length !== 0) { 
      role.memberId = x[0].memberId
    }
  })
}

const checkDate = (date) => {
  let retDate
  if (!date) {
    let currentDate = new Date()
    let currentDay = currentDate.getDate()
    if (currentDay < 10) currentDay = '0' + currentDay
    let currentMonth = currentDate.getMonth() + 1
    if (currentMonth < 10) currentMonth = '0' + currentMonth
    retDate = currentDate.getFullYear() + '-' + currentMonth + '-' + currentDay
  } else {
    retDate = date
  }
  return retDate
}

const sqlGetRoles = "SELECT role_id AS roleId, role_name AS roleName FROM roles"

const sqlGetExistingSchedule = (date) => {
  return `SELECT member_id AS memberId, role_id AS roleId, date FROM history WHERE date = '${date}'` // '2017-12-25'
}

const sqlLastServed = (numRows) => {
  return `
        SELECT m.member_id AS memberId
        FROM members m
        LEFT JOIN history h ON h.member_id = m.member_id AND (h.date = (SELECT MAX(h1.date) FROM history h1 WHERE h1.member_id = m.member_id))
        WHERE m.exempt = 0
        ORDER BY (h.history_id IS NULL) DESC, h.date ASC, m.last_name ASC
        LIMIT ${numRows}
      `
}

const filterLastServed = (lastServed, finalSchedule) => {
  // eliminate from result members already in finalSchedule
  // Convert to arrays first
  let lastServedArr = lastServed.map((r) => r.memberId)
  let finalScheduleArr = finalSchedule.map((r) => r.memberId)
  return lastServedArr.filter((i) => !finalScheduleArr.includes(i))
}

const fillLastServed = (lastServed, finalSchedule) => {
  finalSchedule.forEach((r) => {
    if (!r.memberId) {
      let id = lastServed.shift()
      r.memberId = id
    }
  })
  return finalSchedule
}

router.get('/schedule/:date?', function(req, res, next) {
  let db
  let date = checkDate(req.params.date)
  let finalSchedule // starts as tmp, will be final when routine is done
  let numberOfRoles
  mysql.createConnection(connectionConfig).then((conn) => {
    // 1.
    db = conn
    return conn.query(sqlGetRoles)
  }).then((result) => {
    // 2.
    numberOfRoles = result.length
    finalSchedule = makeSchedule(result)
    return db.query(sqlGetExistingSchedule(date))
  }).then((result) => {
    // 3.
    fillExistingSchedule(finalSchedule, result)
    return db.query(sqlLastServed(numberOfRoles * 2))
  }).then((result) => {
    // 4.
    db.end()
    let lastServed = filterLastServed(result, finalSchedule)
    res.send(fillLastServed(lastServed, finalSchedule))
  }).catch((err) => {
    console.warn('catch', err)
    db.end()
  })
})

router.get('/roles', function(req, res) {
  let sql = 'SELECT * FROM roles'
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


// // not needed with new members data structure
// router.get('/exclusions', function(req, res) {
//   let sql = 'select * from exclusions'
//   // console.log('/exclusions: sql', sql)
//   mysql.createConnection(connectionConfig).then((conn) => {
//     let result = conn.query(sql)
//     conn.end()
//     return result
//   }).then((rows) => {
//     // console.log('routes.schedule/exclusions: rows \n', rows)
//     res.send(rows)
//   })
// })

// router.get('/scheduleMembers', function(req, res) {
//   // let sql = 'select (@row:=@row+1) as sequence, h.history_id, h.date, h.member_id, h.role_id, h.served, m.first_name, r.role_name '
//   // sql += 'from history as h, members as m, roles as r, (select @row := 0) s '
//   // sql += 'where h.member_id = m.member_id and h.role_id = r.role_id and m.exempt <> 1 '
//   // sql += 'order by date desc '
//   // sql += 'limit 12;'
//
//   let sql = `
//     SELECT (select (@row:=@row+1) FROM (select @row := 0) s) as sequence, m.member_id, m.first_name, m.last_name, h.history_id, h.date, h.role_id, r.role_name, m.comment
//     FROM members m
//     LEFT JOIN history h ON h.member_id = m.member_id AND (h.date = (SELECT MAX(h1.date) FROM history h1 WHERE h1.member_id = m.member_id))
//     LEFT JOIN roles r on r.role_id = h.role_id
//     WHERE m.exempt = 0
//     ORDER BY (h.history_id IS NULL) DESC, h.date ASC, m.last_name ASC
//     LIMIT 12;
//   `
//   console.log('/scheduleMembers: sql', sql)
//   // console.log('/next6: sql', sql)
//   mysql.createConnection(connectionConfig).then((conn) => {
//     let result = conn.query(sql)
//     conn.end()
//     return result
//   }).then((rows) => {
//     console.log('routes.schedule/scheduleMembers: rows \n', rows)
//     res.send(rows)
//   })
// })
