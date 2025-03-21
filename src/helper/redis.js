const { redisClient: redis } = require("../configs/redis");

const saveOtp = async (phone, otpCode) => {
  try {
    return await redis.set(`otp:${phone}`, otpCode, "EX", 60);
  } catch (error) {
    throw new error();
  }
};

const getOtp = async (phone) => {
  try {
    const otp = await redis.get(`otp:${phone}`);

    if (!otp) {
      return {
        remainingTime: 0,
        expired: true,
      };
    }
    return otp;
  } catch (error) {
    throw error;
  }
};

const getOtpInfo = async (phone) => {
  try {
    const remainingTime = await redis.ttl(`otp:${phone}`); // Time in seconds

    if (remainingTime <= 0) {
      return {
        remainingTime: 0,
        expired: true,
      };
    }

    const minutes = Math.floor(remainingTime / 60);

    const seconds = remainingTime % 60;

    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    return {
      expired: false,
      remainingTime: formattedTime,
    };
  } catch (error) {
    throw error;
  }
};

const removeOtp = async (phone) => {
  try {
    return await redis.del(`otp:${phone}`);
  } catch (error) {
    throw error;
  }
};

module.exports = { saveOtp, getOtp, getOtpInfo, removeOtp };
