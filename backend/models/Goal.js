const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    targetValue: {
      type: mongoose.Schema.Types.Mixed, // Can be number, string, etc.
    },
    currentValue: {
      type: mongoose.Schema.Types.Mixed,
      default: 0,
    },
    unit: {
      type: String, // kg, ₹, %, etc.
    },
    deadline: {
      type: Date,
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed", "paused", "cancelled"],
      default: "not-started",
      index: true,
    },
    milestones: [
      {
        title: String,
        targetValue: mongoose.Schema.Types.Mixed,
        deadline: Date,
        completed: { type: Boolean, default: false },
        completedAt: Date,
      },
    ],
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    tags: [String],
    notes: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
GoalSchema.index({ user: 1, status: 1 });
GoalSchema.index({ user: 1, category: 1, status: 1 });
GoalSchema.index({ user: 1, deadline: 1 });
GoalSchema.index({ user: 1, priority: 1, status: 1 });
GoalSchema.index({ user: 1, createdAt: -1 });

// Auto-update progress based on current/target values
GoalSchema.pre("save", function (next) {
  if (this.targetValue && this.currentValue !== undefined) {
    if (typeof this.targetValue === "number" && typeof this.currentValue === "number") {
      if (this.targetValue > 0) {
        this.progress = Math.min(100, Math.max(0, (this.currentValue / this.targetValue) * 100));
      }
    }
  }
  
  // Auto-update status
  if (this.progress >= 100 && this.status !== "completed") {
    this.status = "completed";
    this.completedAt = new Date();
  } else if (this.progress > 0 && this.status === "not-started") {
    this.status = "in-progress";
  }
  
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Goal", GoalSchema);

