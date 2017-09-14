import express from 'express'
import connection from '../db'

const router = express.Router();

var sql = "SELECT member_id AS _id, firstname, lastname, email FROM members";

router.get('/', function(req, res) {
  connection.query(sql, function (err, rows, fields) {
    if (err) throw err

    var results_json = JSON.stringify(rows);

    console.log('results: ', rows);
    res.send(results_json);
  //console.log(connection);
  //res.send('done')
  })
});

router.get('/hello', function(req, res) {
  res.send('Hello again from route II');
});

router.get('/users', function(req, res) {
  res.send('List of  users.');
});

module.exports = router;
