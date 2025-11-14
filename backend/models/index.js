/**
 * Centralized model exports
 * Import all models from here for consistency
 */

const User = require("./User");
const DailyLog = require("./DailyLog");
const Goal = require("./Goal");
const AIAssistantLog = require("./AIAssistantLog");

module.exports = {
  User,
  DailyLog,
  Goal,
  AIAssistantLog,
};

