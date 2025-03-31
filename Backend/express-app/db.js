import mysql from "mysql2";

const conn = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "NexusCloudDB",
})

export default conn;