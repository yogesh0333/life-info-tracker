const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const aiService = require("../services/aiService");

// @route   POST /api/ai/ask
// @desc    Get AI response
// @access  Private
router.post("/ask", auth, async (req, res) => {
  try {
    const { question, provider } = req.body;
    const user = await User.findById(req.user._id);

    if (!question) {
      return res.status(400).json({ error: "Please provide a question" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create personalized prompt
    const prompt = `User Profile:
- Name: ${user.name}
- Life Path: ${user.astrology.lifePath}
- Planetary Ruler: ${user.astrology.planetaryRuler.planet}
- Archetype: ${user.astrology.archetype}
- Core Vibration: ${user.astrology.coreVibration}
- Zodiac Sign: ${user.astrology.zodiacSign}
- Age: ${Math.floor((new Date() - user.dob) / (365.25 * 24 * 60 * 60 * 1000))}

User Question: ${question}

Provide a personalized, helpful answer based on their astrological profile and the question asked.`;

    const systemPrompt = `You are a wise AI assistant specializing in Vedic astrology, life coaching, and spiritual guidance. Provide practical, personalized advice based on the user's astrological profile. Be encouraging, honest, and actionable.`;

    const response = await aiService.generateCompletion(prompt, {
      systemPrompt,
      provider: provider || process.env.DEFAULT_AI_PROVIDER || "openai",
      temperature: 0.8,
      maxTokens: 2000,
    });

    res.json({
      success: true,
      response: response.content,
      astrology: {
        lifePath: user.astrology.lifePath,
        archetype: user.astrology.archetype,
        planet: user.astrology.planetaryRuler.planet,
      },
      provider: response.provider,
    });
  } catch (error) {
    console.error("AI ask error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

// @route   GET /api/ai/daily-guidance
// @desc    Get daily guidance from AI
// @access  Private
router.get("/daily-guidance", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const today = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const prompt = `Provide daily guidance for ${user.name} for today (${today}):

ASTROLOGICAL PROFILE:
- Life Path: ${user.astrology.lifePath}
- Planetary Ruler: ${user.astrology.planetaryRuler.planet}
- Archetype: ${user.astrology.archetype}
- Zodiac Sign: ${user.astrology.zodiacSign}
- Mahadasha: ${user.astrology.mahadasha}

Provide guidance on:
1. Career & Work (what to focus on today)
2. Health & Fitness (specific activities)
3. Spiritual Practice (mantras, meditation)
4. Finance (decisions to make or avoid)
5. General Tips (colors, directions, lucky times)
6. Things to Avoid Today

Make it personalized and actionable.`;

    const systemPrompt = `You are a comprehensive life advisor combining Vedic astrology, modern productivity, health science, and spiritual wisdom. Provide practical daily guidance.`;

    const response = await aiService.generateCompletion(prompt, {
      systemPrompt,
      temperature: 0.8,
      maxTokens: 2000,
    });

    res.json({
      success: true,
      date: today,
      guidance: response.content,
      astrology: {
        lifePath: user.astrology.lifePath,
        archetype: user.astrology.archetype,
      },
    });
  } catch (error) {
    console.error("Daily guidance error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

module.exports = router;

