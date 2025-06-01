const Pool = require('pg').Pool;
const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database: "backup",
    password:"Dang12c6",
    port : 5432,
    max: 10,         // số kết nối tối đa trong pool
    idleTimeoutMillis: 30000, // timeout khi không dùng
    connectionTimeoutMillis: 2000, // timeout khi kết nối mới
});



module.exports = pool;