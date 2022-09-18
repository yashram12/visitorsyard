import mysql from 'mysql'
import 'dotenv/config'

const conn = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DB
    /*host:"localhost",
    user:'root',
    password:"Vk2001$$",
    database:'pub'*/
});

export default conn;