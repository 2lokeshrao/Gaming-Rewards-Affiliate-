const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

// 1. Restore MySQL import
server = server.replace(/\/\/ import mysql from "mysql2\/promise";/g, "import mysql from 'mysql2/promise';");

// 2. Remove JSON DB and restore MySQL pool
const regex = /\/\/ 1\. JSON FILE DB IMPLEMENTATION \(REPLACING MYSQL\)[\s\S]*?const pool = \{[\s\S]*?\}\;\n/g;

const mysqlCode = `// 1. SECURE MYSQL INITIALIZATION
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'affiliate_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
`;

if (server.match(regex)) {
  server = server.replace(regex, mysqlCode);
  fs.writeFileSync('server.ts', server);
  console.log("Reverted to MySQL successfully!");
} else {
  console.log("Regex didn't match.");
}
