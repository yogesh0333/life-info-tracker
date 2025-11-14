const mongoose = require("mongoose");

const AIAssistantLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    response: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      enum: ["openai", "claude", "gemini", "cohere", "groq"],
    },
    model: {
      type: String,
    },
    tokens: {
      prompt: Number,
      completion: Number,
      total: Number,
    },
    context: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Store context used for the query
      default: {},
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
AIAssistantLogSchema.index({ user: 1, createdAt: -1 });
AIAssistantLogSchema.index({ provider: 1, createdAt: -1 });
AIAssistantLogSchema.index({ user: 1, rating: 1 });

module.exports = mongoose.model("AIAssistantLog", AIAssistantLogSchema);

