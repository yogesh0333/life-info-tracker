const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateAstrologicalProfile } = require("../utils/astrology");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "default_secret", {
    expiresIn: "30d",
  });
};

// @route   POST /api/auth/register
// @desc    Register new user and generate blueprint
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, dob, tob, pob, gender } = req.body;

    // Validate required fields
    if (!name || !email || !password || !dob) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Generate astrological profile
    const astrologyProfile = generateAstrologicalProfile(dob, tob, pob);

    // Create user
    user = new User({
      name,
      email,
      password,
      dob: new Date(dob),
      tob: tob || null,
      pob: pob || null,
      gender: gender || "male",
      astrology: astrologyProfile,
      blueprint: {
        generated: false, // Will be set to true after AI generation
        generatedAt: new Date(),
        pages: [
          "dashboard",
          "daily-tracker",
          "ai-assistant",
          "career",
          "lifestyle",
          "health",
          "family",
          "finance",
          "spiritual",
          "remedies",
          "vastu",
          "past-karma",
          "medical-astrology",
          "pilgrimage",
        ],
        content: new Map(), // Will be populated by AI
      },
    });

    await user.save();

    // Generate AI blueprint content asynchronously (don't wait)
    const blueprintGenerator = require("../services/blueprintGenerator");
    blueprintGenerator.generateBlueprint(user).then((content) => {
      user.blueprint.content = content;
      user.blueprint.generated = true;
      user.save().catch((err) => console.error("Error saving blueprint:", err));
    }).catch((err) => {
      console.error("Error generating blueprint:", err);
      // Mark as generated even if AI fails (user can regenerate)
      user.blueprint.generated = true;
      user.save().catch((saveErr) => console.error("Error saving:", saveErr));
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered. Blueprint generation in progress...",
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", require("../middleware/auth"), async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

