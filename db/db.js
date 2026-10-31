const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  connectionLimit:10,
  host:'localhost',
  user:'root',
  password:'',
  database:'agenda_comunitaria',
  port:3306
})

module.exports = pool;