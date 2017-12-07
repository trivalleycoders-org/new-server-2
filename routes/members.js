import express from 'express'
// import connection from '../db'
import mysql from 'promise-mysql'
const router = express.Router();

// create
router.post('/', function(req, res) {
  let newMember = req.body.member;
  // make sure we're not passing a member_id into the INSERT query
  ('member_id' in newMember) && delete newMember.member_id;
  // the following "placeholder" syntax is explained here: https://www.w3resource.com/node.js/nodejs-mysql.php#Escaping_query
  let sql = "INSERT INTO members SET ?";
  mysql.createConnection(connectionConfig).then((conn) => {
    let result = conn.query(sql, newMember);
    conn.end()
    return result
  }).then((rows) => {
    // console.log('rows', rows)
    res.send(rows)
  })
})

// read
router.get('/', function(req, res) {
  // console.log('connectionConfig', connectionConfig)
  let sql = "SELECT * FROM members WHERE active != 0 ORDER BY last_name";

  let members_sql = `
    SELECT m.member_id AS id, m.first_name AS firstName, m.last_name AS lastName, m.email, m.exempt, m.comment, m.phone_number AS phoneNumber, m.active, h.date AS lastRoleDate, r.role_name AS lastRoleName
    FROM members m
    LEFT JOIN history h ON h.member_id = m.member_id AND (h.date = (SELECT MAX(h1.date) FROM history h1 WHERE h1.member_id = m.member_id))
    LEFT JOIN roles r on r.role_id = h.role_id
    ORDER BY (h.history_id IS NULL) DESC, h.date ASC, m.last_name ASC
  `

  let asort_sql = 'SELECT member_id AS id FROM members ORDER BY last_name ASC'

  let exclusions_sql = `
    SELECT e.member_id AS id, GROUP_CONCAT(r.role_name) AS excludedRoleIds
    FROM exclusions e
    LEFT JOIN roles r ON r.role_id = e.role_id
    GROUP BY e.member_id
  `
  let db, members_orig
  let asort = [], hsort = []
  let members = {}, exclusions = {}
  mysql.createConnection(connectionConfig).then((conn) => {
    db = conn
    let result = db.query(sql)
    return result
  }).then((rows) => {
    // console.log('rows', rows)
    res.send(rows)
  })
})

// read
//
// memberId:           members.member_id
// firstName:          members.first_name
// lastName:           members.last_name
// email:              members.email
// exempt:             members.exempt
// comment:            members.comment
// phoneNumber:        members.phone_number
// active:             members.active
// lastServedDate:     MAX(history.date)
// lastServedRoleName: roles[history.role_id].role_name
// exclusions:         exlusions [role_id ...]
//
// members_sql = SELECT m.member_id, m.first_name, m.last_name, m.email, m.exempt, m.comment, m.phone_number, m.active, h.history_id, h.date, r.role_name
//               FROM members m
//               LEFT JOIN history h ON h.member_id = m.member_id AND (h.date = (SELECT MAX(h1.date) FROM history h1 WHERE h1.member_id = m.member_id))
//               LEFT JOIN roles r on r.role_id = h.role_id
//               ORDER BY (h.history_id IS NULL) DESC, h.date ASC, m.last_name ASC
//
// asort_sql = SELECT member_id FROM members ORDER BY last_name ASC
//
// exlusions_sql = SELECT e.member_id, GROUP_CONCAT(r.role_name)
//                 FROM exclusions e
//                 LEFT JOIN roles r ON r.role_id = e.role_id
//                 GROUP BY e.member_id
router.get('/:type?', function(req, res) {
  // console.log('connectionConfig', connectionConfig)
  let sql = "SELECT * FROM members WHERE active != 0 ORDER BY last_name";

  if (req.params.type !== 'new') {
    let db, members_orig
    mysql.createConnection(connectionConfig).then((conn) => {
      db = conn
      let result = db.query(sql)
      return result
    }).then((rows) => {
      members_orig = rows;
      // console.log('members_orig', members_orig)
      res.send(members_orig)
    })

  } else {

    let members_sql = `
      SELECT m.member_id AS id, m.first_name AS firstName, m.last_name AS lastName, m.email, m.exempt, m.comment, m.phone_number AS phoneNumber, m.active, h.date AS lastRoleDate, r.role_name AS lastRoleName
      FROM members m
      LEFT JOIN history h ON h.member_id = m.member_id AND (h.date = (SELECT MAX(h1.date) FROM history h1 WHERE h1.member_id = m.member_id))
      LEFT JOIN roles r on r.role_id = h.role_id
      ORDER BY (h.history_id IS NULL) DESC, h.date ASC, m.last_name ASC
    `

    let asort_sql = 'SELECT member_id AS id FROM members ORDER BY last_name ASC'

    let exclusions_sql = `
      SELECT e.member_id AS id, GROUP_CONCAT(r.role_name) AS excludedRoleIds
      FROM exclusions e
      LEFT JOIN roles r ON r.role_id = e.role_id
      GROUP BY e.member_id
    `
    let db
    let asort = [], hsort = []
    let members = {}, exclusions = {}
    mysql.createConnection(connectionConfig).then((conn) => {
      db = conn
      return db.query(asort_sql)  // member IDs sorted by member last name
    }).then((rows) => {
      for (let i = 0; i < rows.length; i++) {
        asort[i] = rows[i]['id']
      }
      // console.log('memberIdsByAlpha', asort)

      return db.query(exclusions_sql)  // role exclusions
    }).then((rows) => {
      let mid
      for (let i = 0; i < rows.length; i++) {
        mid = rows[i]['id']
        exclusions[mid] = rows[i]['excludedRoleIds']
      }
      // console.log('exclusions', exclusions)

      return db.query(members_sql)  // members with history and role exclusions
    }).then((rows) => {
      db.end()
      let mid
      for (let i = 0; i < rows.length; i++) {
        mid = rows[i]['id']
        hsort[i] = mid
        members[mid] = Object.assign({}, rows[i])
        members[mid]['exclusions'] = exclusions[mid]
          ? exclusions[mid].split(',')
          : []
      }
      // console.log('members', members)
      // console.log('memberIdsByLastRoleDate', hsort)

      const members_full = {
        members: members,
        idsByAlpha: asort,
        idsByLastRoleDate: hsort,
      }
      console.log('members_full', members_full)
      res.send(members_full)
    })
  }
})

// update (handles member information updates, active/inactive swtiching)
router.put('/:id', function(req, res) {
  let updatedMember = req.body.member;
  // make sure we never update an existing member's member_id
  ('member_id' in updatedMember) && delete updatedMember.member_id;
  // the following "placeholder" syntax is explained here: https://www.w3resource.com/node.js/nodejs-mysql.php#Escaping_query
  let sql = "UPDATE members SET ? WHERE member_id = ?";
  mysql.createConnection(connectionConfig).then((conn) => {
    let result = conn.query(sql, [updatedMember, req.params.id])
    conn.end()
    return result
  }).then((rows) => {
    // console.log('rows', rows)
    res.send(rows)
  })
})

// delete
router.delete('/:id', function(req, res) {
  // the following "placeholder" syntax is explained here: https://www.w3resource.com/node.js/nodejs-mysql.php#Escaping_query
  let sql = "DELETE FROM members WHERE member_id = ?";
  mysql.createConnection(connectionConfig).then((conn) => {
    let result = conn.query(sql, req.params.id)
    conn.end()
    return result
  }).then((rows) => {
    console.log('rows /n', rows)
    res.send(rows)
  })
})

module.exports = router;
