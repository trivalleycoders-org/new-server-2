import mysql from 'mysql'

export const db = () => {
  const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'karl',
    database : 'rotary_test'
  })

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  })
  return connection
}

export default { db }
