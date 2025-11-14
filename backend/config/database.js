const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/life_info_tracker";

    // Add authSource for Railway MongoDB if not present
    if (mongoUri.includes("railway") || mongoUri.includes("rlwy.net")) {
      if (!mongoUri.includes("authSource")) {
        mongoUri += (mongoUri.includes("?") ? "&" : "?") + "authSource=admin";
      }
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
