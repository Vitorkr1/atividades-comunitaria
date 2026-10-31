const mysql = require('mysql2/promise')
const fs = require('node:fs')
const path = require('node:path')

// Configure as variáveis DB_* no serviço da API no Render.
// Salve o certificado CA baixado da Aiven como ca.pem nesta pasta.
const pool = mysql.createPool({
  connectionLimit: 10,
  waitForConnections: true,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, 'ca.pem')),
    rejectUnauthorized: true
  }
})

module.exports = pool
