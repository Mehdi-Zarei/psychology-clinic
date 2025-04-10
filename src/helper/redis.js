const { redisClient: redis } = require("../configs/redis");

const saveData = async (key, value, ttl) => {
  try {
    return await redis.set(key, value, "EX", ttl);
  } catch (error) {
    throw new error();
  }
};

const getData = async (key) => {
  try {
    const data = await redis.get(key);

    if (!data) {
      return {
        remainingTime: 0,
        expired: true,
      };
    }
    return data;
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

const removeData = async (key) => {
  try {
    return await redis.del(key);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  saveData,
  getData,
  getOtpInfo,
  removeData,
};
