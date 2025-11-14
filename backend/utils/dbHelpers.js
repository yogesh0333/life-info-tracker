/**
 * Database Helper Utilities
 * Common database operations and utilities
 */

const { User, DailyLog, Goal, AIAssistantLog } = require("../models");

/**
 * Clean old data (for maintenance)
 */
const cleanOldData = async (daysOld = 365) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // Clean old AI assistant logs (keep last year)
    const deletedLogs = await AIAssistantLog.deleteMany({
      createdAt: { $lt: cutoffDate },
      rating: { $exists: false }, // Keep rated logs
    });

    console.log(`🧹 Cleaned ${deletedLogs.deletedCount} old AI assistant logs`);

    return {
      success: true,
      deletedLogs: deletedLogs.deletedCount,
    };
  } catch (error) {
    console.error("Error cleaning old data:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get user statistics
 */
const getUserStats = async (userId) => {
  try {
    const [
      totalLogs,
      totalGoals,
      completedGoals,
      recentLogs,
      activeGoals,
    ] = await Promise.all([
      DailyLog.countDocuments({ user: userId }),
      Goal.countDocuments({ user: userId }),
      Goal.countDocuments({ user: userId, status: "completed" }),
      DailyLog.countDocuments({
        user: userId,
        date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      Goal.countDocuments({
        user: userId,
        status: { $in: ["in-progress", "not-started"] },
      }),
    ]);

    return {
      totalLogs,
      totalGoals,
      completedGoals,
      activeGoals,
      recentLogs,
      completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return null;
  }
};

/**
 * Backup user data (export to JSON)
 */
const exportUserData = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    const logs = await DailyLog.find({ user: userId }).sort({ date: -1 });
    const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });
    const aiLogs = await AIAssistantLog.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(100); // Last 100 AI interactions

    return {
      user: user.toObject(),
      logs: logs.map((log) => log.toObject()),
      goals: goals.map((goal) => goal.toObject()),
      aiLogs: aiLogs.map((log) => log.toObject()),
      exportedAt: new Date(),
    };
  } catch (error) {
    console.error("Error exporting user data:", error);
    return null;
  }
};

/**
 * Validate and sanitize user input
 */
const sanitizeInput = (input, type = "string") => {
  if (input === null || input === undefined) return null;

  switch (type) {
    case "string":
      return String(input).trim().substring(0, 10000); // Max 10k chars
    case "email":
      return String(input).toLowerCase().trim();
    case "number":
      const num = Number(input);
      return isNaN(num) ? null : num;
    case "date":
      const date = new Date(input);
      return isNaN(date.getTime()) ? null : date;
    default:
      return input;
  }
};

/**
 * Paginate query results
 */
const paginate = async (query, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      query.skip(skip).limit(limit),
      query.model.countDocuments(query.getQuery()),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error("Error paginating:", error);
    return null;
  }
};

module.exports = {
  cleanOldData,
  getUserStats,
  exportUserData,
  sanitizeInput,
  paginate,
};

