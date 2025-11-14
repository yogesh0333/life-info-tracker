const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { generateAstrologicalProfile } = require("../utils/astrology");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    dob: {
      type: Date,
      required: true,
    },
    tob: {
      type: String, // Time of birth (HH:MM format)
    },
    pob: {
      type: String, // Place of birth
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    astrology: {
      lifePath: Number,
      birthNumber: Number,
      zodiacSign: String,
      planetaryRuler: {
        planet: String,
        archetype: String,
        energy: String,
      },
      ascendant: String,
      mahadasha: String,
      coreVibration: String,
      archetype: String,
    },
    blueprint: {
      generated: {
        type: Boolean,
        default: false,
      },
      generatedAt: Date,
      pages: [String], // List of generated pages
      content: {
        type: Map,
        of: mongoose.Schema.Types.Mixed, // Store AI-generated content for each page
        default: {},
      },
    },
    lastLogin: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
// Note: email already has unique: true which creates an index automatically
UserSchema.index({ "astrology.lifePath": 1 });
UserSchema.index({ "blueprint.generated": 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ lastLogin: -1 });

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate astrological profile before saving
UserSchema.pre("save", async function (next) {
  if (this.isNew && this.dob && !this.astrology.lifePath) {
    const profile = generateAstrologicalProfile(
      this.dob.toISOString().split("T")[0],
      this.tob,
      this.pob
    );
    this.astrology = profile;
  }
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile (without password)
UserSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model("User", UserSchema);
