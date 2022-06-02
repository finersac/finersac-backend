import env from "config/env";
import * as mysql from "mysql";

// Create a connection to the database
const connection = mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  insecureAuth: true,
});
// open the MySQL connection
connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});
export default connection;
