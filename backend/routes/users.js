const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, dob, tob, pob, gender } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (dob) {
      user.dob = new Date(dob);
      // Regenerate astrology if DOB changed
      const { generateAstrologicalProfile } = require("../utils/astrology");
      user.astrology = generateAstrologicalProfile(
        dob,
        user.tob,
        user.pob
      );
    }
    if (tob !== undefined) user.tob = tob;
    if (pob) user.pob = pob;
    if (gender) user.gender = gender;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

