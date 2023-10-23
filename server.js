require('dotenv').config({ path: './.env' });
const mysql = require("mysql2/promise");

const app = require('./app.js');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

module.exports = pool;


const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});