var express = require("express");
var router = express.Router()
const { videoToken } = require("./../tokens");
const config = require("./../api_config");
const sendTokenResponse = require("./../service/sendTokenResponse");

router.post("/", (req, res) => {
  const identity = req.body.identity;
  const room = req.body.room;
  console.log(
    "Identity: " +
      identity +
      " room :" +
      room +
      " config: " +
      config.twilio.accountSid
  );
  // console.log(config.twilio);
  const token = videoToken(identity, room, config);
  console.log(`token ${token}`)
  sendTokenResponse(token, res);
});

module.exports = router;
