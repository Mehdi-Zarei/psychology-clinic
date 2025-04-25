const mongoose = require("mongoose");
const envConfigs = require("../envConfigs");
const loadBookingJobs = require("../utils/schedulerJob");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(envConfigs.db.mongoUri);
    console.log(
      `✅ Connected to MongoDB successfully on : ${mongoose.connection.host}.`
    );
    loadBookingJobs();
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
