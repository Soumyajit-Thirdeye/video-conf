const iniParser = require("./../service/iniParser");
const mysql = require("mysql");
const log = require("log-to-file");
const fs = require("fs");

try {
  var data = fs.readFileSync(`./config/config.ini`, "utf8");
  var configDetails = iniParser(data);
  var DATABASE_HOST = configDetails["database_config"]["HOST"];
  var USER = configDetails["database_config"]["USER"];
  var PASSWORD = configDetails["database_config"]["PASSWORD"];
  var DATABASE = configDetails["database_config"]["DATABASE"];
  console.log(`${DATABASE_HOST} ${USER} ${PASSWORD} ${DATABASE}`);
} catch (e) {
  console.log(e);
}

var conn = mysql.createConnection({
  host: DATABASE_HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});

conn.connect(function (error) {
  if (!!error) {
    console.log("Error while creating database connection ", error);
    log("Error while creating database connection ", error);
  } else {
    console.log("Database Connected!:)");
    log("Successfully connected to the database!");
  }
});

module.exports = conn;
