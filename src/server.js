require("dotenv").config();
const connectToDatabase = require("./configs/db");
const { connectRedis } = require("./configs/redis");
const app = require("./app");
const envConfigs = require("./envConfigs");

const startServer = async (app, port) => {
  try {
    await Promise.all([connectToDatabase(), connectRedis()]);

    app.listen(port, () => {
      console.log(`🚀 Server is up and running at: ${envConfigs.domain}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error.message);
    process.exit(1);
  }
};

startServer(app, envConfigs.server.port);
