import express from 'express'
import connection from '../db'

const router = express.Router();



router.get('/', function(req, res) {
  var sql = "SELECT * FROM members";
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err

    var results_json = JSON.stringify(rows);

    console.log('results: ', rows);
    res.send(results_json);
  //console.log(connection);
  //res.send('done')
  })
});

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
