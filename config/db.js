import mysql from 'mysql2';

const conn = mysql.createConnection({
    user:"shuja",
    host:"localhost",
    password:"shuja15201",
    database:"testdb",
    port:3306

});

conn.connect((err)=>{
    if(err) throw err;
    console.log("Database connected successfully")
});
export default conn;
