var express = require("express")
var router = express.Router()
var conn = require("./../db/dbConnection")
const { v4: uuidV4 } = require("uuid");

router.post("/", function (req, res, next) {
    console.log(req.body)
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    var email = req.body.email
    var password = req.body.password
    var meetingId = uuidV4();
    values = [[firstName, lastName, email, password, meetingId]]
    console.log(values)
    var sql = `SELECT * FROM testing WHERE email='${email}'`
    conn.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.status(204).send("User already exist with this email ID");
      } else {
        var sql = `INSERT INTO testing (first_name, last_name, email, password, roomId) VALUES ?`;
        conn.query(sql, [values], (err, result) => {
          if (err) {
            throw err;
          } else {
            console.log("1 record inserted");
            res.status(200).send("User details saved in the database");
          }
        });
      }
    })
});

module.exports = router;
