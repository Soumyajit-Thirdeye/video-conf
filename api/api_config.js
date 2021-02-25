const iniParser = require('./service/iniParser')
const fs = require('fs')
try {
  var data = fs.readFileSync(`./config/config.ini`, "utf8");
  var configDetails = iniParser(data);
  var accountSid = configDetails["api_creds"]["TWILIO_ACCOUNT_SID"];
  var apiKey = configDetails["api_creds"]["TWILIO_API_KEY"];
  var apiSecret = configDetails["api_creds"]["TWILIO_API_SECRET"];
} catch (e) {
  console.log(e);
}


module.exports = {
  twilio: {
    accountSid: accountSid,
    apiKey: apiKey,
    apiSecret: apiSecret,
  },
};



