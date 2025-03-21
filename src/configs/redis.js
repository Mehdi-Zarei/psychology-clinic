const { default: Redis } = require("ioredis");
const envConfigs = require("../envConfigs");

const redisClient = new Redis(envConfigs.db.redisUri);

const connectRedis = async () => {
  try {
    await redisClient.ping();
    console.log("✅ Connected to Redis Successfully.");
  } catch (error) {
    console.error("❌ Redis connection error:", error);
    redisClient.quit();
    process.exit(1);
  }
};

redisClient.on("error", (error) => {
  console.error("❌ Redis error:", error);
  setTimeout(() => {
    redisClient
      .connect()
      .catch((err) => console.error("❌ Retry failed:", err));
  }, 5000);
});

module.exports = { redisClient, connectRedis };
