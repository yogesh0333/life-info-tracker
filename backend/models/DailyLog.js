const mongoose = require("mongoose");

const DailyLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    category: {
      type: String,
      enum: [
        "career",
        "health",
        "finance",
        "family",
        "spiritual",
        "lifestyle",
        "learning",
        "other",
      ],
      required: true,
    },
    activity: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number, // in minutes
      min: 0,
    },
    mood: {
      type: String,
      enum: ["excellent", "good", "neutral", "bad", "terrible"],
    },
    energy: {
      type: Number,
      min: 1,
      max: 10,
    },
    tags: [String],
    metrics: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Flexible metrics (weight, steps, etc.)
      default: {},
    },
    notes: {
      type: String,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
DailyLogSchema.index({ user: 1, date: -1 });
DailyLogSchema.index({ user: 1, category: 1, date: -1 });
DailyLogSchema.index({ user: 1, date: 1 }, { unique: false }); // For date range queries

// Prevent duplicate logs for same user/date/activity
DailyLogSchema.index({ user: 1, date: 1, activity: 1 }, { unique: false });

module.exports = mongoose.model("DailyLog", DailyLogSchema);
