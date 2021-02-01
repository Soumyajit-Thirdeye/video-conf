var express = require("express")
var router = express.Router()
var conn = require("./../db/dbConnection");

router.post("/", function (req, res, next) {
    console.log(req.body)
    email = req.body.email
    password = req.body.password
    var sql = `SELECT * FROM testing where email='${email}'`
    // console.log(sql)
    conn.query(sql, (err, result) => {
    console.log("result length is " + result.length);
      if (err) throw err
      if (!result.length > 0) {
          res.status(204).send("User not found with this specific user.")
      } else {
          if(password !== result[0]["password"]) {
            res.status(204).send("Password incorrect for the specific user with this email ID")
          } else{
              res.status(200).send("Login successful")
          }
      }
    });
});

module.exports = router