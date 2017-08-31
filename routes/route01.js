import express from 'express'

const router = express.Router();

router.get('/', function(req, res) {
  res.send('Hello from route01.');
});

router.get('/hello', function(req, res) {
  res.send('Hello again from route01.');
});

router.get('/users', function(req, res) {
  res.send('List of  users.');
});

module.exports = router;
