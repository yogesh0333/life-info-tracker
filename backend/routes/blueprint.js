const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// @route   GET /api/blueprint
// @desc    Get user's blueprint data
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      blueprint: {
        generated: user.blueprint.generated,
        generatedAt: user.blueprint.generatedAt,
        pages: user.blueprint.pages,
        astrology: user.astrology,
        userInfo: {
          name: user.name,
          email: user.email,
          dob: user.dob,
          gender: user.gender,
        },
      },
    });
  } catch (error) {
    console.error("Get blueprint error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// @route   POST /api/blueprint/regenerate
// @desc    Regenerate user's blueprint
// @access  Private
router.post("/regenerate", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Regenerate astrological profile
    const { generateAstrologicalProfile } = require("../utils/astrology");
    const astrologyProfile = generateAstrologicalProfile(
      user.dob.toISOString().split("T")[0],
      user.tob,
      user.pob
    );

    user.astrology = astrologyProfile;
    user.blueprint.generated = true;
    user.blueprint.generatedAt = new Date();

    await user.save();

    res.json({
      success: true,
      message: "Blueprint regenerated successfully",
      blueprint: {
        generated: user.blueprint.generated,
        generatedAt: user.blueprint.generatedAt,
        pages: user.blueprint.pages,
        astrology: user.astrology,
      },
    });
  } catch (error) {
    console.error("Regenerate blueprint error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

