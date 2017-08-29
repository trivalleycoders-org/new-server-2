import express from 'express'

const route01 = express.Router();

route01.get('/', function(req, res) {
  res.send('Hello from route01.');
});

route01.get('/users', function(req, res) {
  res.send('List of  users.');
});

module.exports = route01;
