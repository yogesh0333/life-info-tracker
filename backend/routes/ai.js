const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// @route   POST /api/ai/ask
// @desc    Get AI response
// @access  Private
router.post("/ask", auth, async (req, res) => {
  try {
    const { question } = req.body;
    const user = await User.findById(req.user._id);

    if (!question) {
      return res.status(400).json({ error: "Please provide a question" });
    }

    // Placeholder AI response - integrate OpenAI/Claude here
    const response = `Based on your Life Path ${user.astrology.lifePath} (${user.astrology.planetaryRuler.planet}), ${question}`;

    res.json({
      success: true,
      response,
      astrology: {
        lifePath: user.astrology.lifePath,
        archetype: user.astrology.archetype,
      },
    });
  } catch (error) {
    console.error("AI ask error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

