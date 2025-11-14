const mongoose = require("mongoose");

/**
 * Robust Database Connection with Retry Logic
 */
const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      let mongoUri =
        process.env.MONGODB_URI || "mongodb://localhost:27017/life_info_tracker";

      // Add authSource for Railway MongoDB if not present
      if (mongoUri.includes("railway") || mongoUri.includes("rlwy.net")) {
        if (!mongoUri.includes("authSource")) {
          mongoUri += (mongoUri.includes("?") ? "&" : "?") + "authSource=admin";
        }
      }

      const options = {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10, // Maintain up to 10 socket connections
        minPoolSize: 2, // Maintain at least 2 socket connections
        bufferMaxEntries: 0, // Disable mongoose buffering
        bufferCommands: false, // Disable mongoose buffering
        heartbeatFrequencyMS: 10000, // Check connection health every 10 seconds
      };

      const conn = await mongoose.connect(mongoUri, options);

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);

      // Setup connection event handlers
      mongoose.connection.on("error", (err) => {
        console.error(`❌ MongoDB Connection Error: ${err.message}`);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("⚠️  MongoDB Disconnected. Attempting to reconnect...");
      });

      mongoose.connection.on("reconnected", () => {
        console.log("✅ MongoDB Reconnected");
      });

      // Graceful shutdown
      process.on("SIGINT", async () => {
        await mongoose.connection.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
      });

      return conn;
    } catch (error) {
      console.error(
        `❌ MongoDB Connection Error (Attempt ${i + 1}/${retries}): ${error.message}`
      );

      if (i < retries - 1) {
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 1.5; // Exponential backoff
      } else {
        console.error("❌ Failed to connect to MongoDB after all retries");
        process.exit(1);
      }
    }
  }
};

/**
 * Check database health
 */
const checkDatabaseHealth = async () => {
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return {
      status: state === 1 ? "healthy" : "unhealthy",
      state: states[state] || "unknown",
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
  } catch (error) {
    return {
      status: "error",
      error: error.message,
    };
  }
};

/**
 * Get database statistics
 */
const getDatabaseStats = async () => {
  try {
    const db = mongoose.connection.db;
    const stats = await db.stats();

    return {
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize,
    };
  } catch (error) {
    console.error("Error getting database stats:", error);
    return null;
  }
};

module.exports = {
  connectDB,
  checkDatabaseHealth,
  getDatabaseStats,
};
