const axios = require("axios");
const envConfigs = require("../envConfigs");

const sentSms = async (userPhone, smsPattern, smsVariable, data) => {
  try {
    const response = await axios.post("http://ippanel.com/api/select", {
      op: "pattern",
      user: envConfigs.otp.user,
      pass: envConfigs.otp.pass,
      fromNum: "3000505",
      toNum: userPhone,
      patternCode: smsPattern,
      inputData: [{ [smsVariable]: data }],
    });

    if (Array.isArray(response.data) || response.data.length > 1) {
      console.log("SMS Error Body -->", response.data);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("SMS Error -->", error);
    return { success: false };
  }
};

module.exports = sentSms;
