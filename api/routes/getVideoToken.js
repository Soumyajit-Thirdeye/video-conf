var express = require("express");
var router = express.Router()
const { videoToken } = require("./../tokens");
const config = require("../api_config");
const sendTokenResponse = require('./../service/sendTokenResponse')

router.get("/", (req, res) => {
  const identity = req.query.identity;
  const room = req.query.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

module.exports = router;