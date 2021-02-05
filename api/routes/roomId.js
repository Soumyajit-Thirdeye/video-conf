var express = require("express");
var router = express.Router();
var conn = require("./../db/dbConnection");

router.post("/", function (req, res, next) {
  console.log(req.body);
  email = req.body.email;
  var sql = `SELECT * FROM testing where email='${email}'`;
  conn.query(sql, (err, result) => {
    console.log("result length is " + result.length);
    if (err) throw err;
    if (!result.length > 0) {
      res.status(204).send("Something Went Wrong!");
    } else {
        const roomId = result[0].roomId;
        const name = result[0].first_name;
        res
        .status(200)
        .send({name: name, roomId: roomId});
    }
  });
});

module.exports = router;