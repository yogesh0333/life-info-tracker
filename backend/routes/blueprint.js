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

    // Convert Map to Object for JSON response
    const contentObj = user.blueprint.content 
      ? Object.fromEntries(user.blueprint.content) 
      : {};

    res.json({
      success: true,
      blueprint: {
        generated: user.blueprint.generated,
        generatedAt: user.blueprint.generatedAt,
        pages: user.blueprint.pages,
        astrology: user.astrology,
        content: contentObj, // AI-generated content
        userInfo: {
          name: user.name,
          email: user.email,
          dob: user.dob ? user.dob.toISOString().split('T')[0] : null,
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
// @desc    Regenerate user's blueprint with AI
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
    user.blueprint.generated = false;
    user.blueprint.generatedAt = new Date();
    user.blueprint.content = new Map();

    await user.save();

    // Generate AI blueprint content
    const blueprintGenerator = require("../services/blueprintGenerator");
    const content = await blueprintGenerator.generateBlueprint(user);

    user.blueprint.content = content;
    user.blueprint.generated = true;
    await user.save();

    res.json({
      success: true,
      message: "Blueprint regenerated successfully with AI",
      blueprint: {
        generated: user.blueprint.generated,
        generatedAt: user.blueprint.generatedAt,
        pages: user.blueprint.pages,
        astrology: user.astrology,
        content: Object.fromEntries(user.blueprint.content),
      },
    });
  } catch (error) {
    console.error("Regenerate blueprint error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

// @route   GET /api/blueprint/page/:pageName
// @desc    Get AI-generated content for a specific page
// @access  Private
router.get("/page/:pageName", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { pageName } = req.params;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if content exists
    const content = user.blueprint.content?.get(pageName);

    if (content) {
      return res.json({
        success: true,
        page: pageName,
        content,
      });
    }

    // Generate content on-demand if not exists
    const blueprintGenerator = require("../services/blueprintGenerator");
    const userProfile = {
      name: user.name,
      dob: user.dob.toISOString().split("T")[0],
      age: Math.floor((new Date() - user.dob) / (365.25 * 24 * 60 * 60 * 1000)),
      astrology: user.astrology,
      gender: user.gender,
    };

    let generatedContent;
    switch (pageName) {
      case "career":
        generatedContent = await blueprintGenerator.generateCareerContent(userProfile);
        break;
      case "lifestyle":
        generatedContent = await blueprintGenerator.generateLifestyleContent(userProfile);
        break;
      case "health":
        generatedContent = await blueprintGenerator.generateHealthContent(userProfile);
        break;
      case "family":
        generatedContent = await blueprintGenerator.generateFamilyContent(userProfile);
        break;
      case "finance":
        generatedContent = await blueprintGenerator.generateFinanceContent(userProfile);
        break;
      case "spiritual":
        generatedContent = await blueprintGenerator.generateSpiritualContent(userProfile);
        break;
      case "remedies":
        generatedContent = await blueprintGenerator.generateRemediesContent(userProfile);
        break;
      case "vastu":
        generatedContent = await blueprintGenerator.generateVastuContent(userProfile);
        break;
      case "medical-astrology":
        generatedContent = await blueprintGenerator.generateMedicalAstrologyContent(userProfile);
        break;
      case "pilgrimage":
        generatedContent = await blueprintGenerator.generatePilgrimageContent(userProfile);
        break;
      default:
        return res.status(404).json({ error: "Page not found" });
    }

    // Save generated content
    if (!user.blueprint.content) {
      user.blueprint.content = new Map();
    }
    user.blueprint.content.set(pageName, generatedContent);
    await user.save();

    res.json({
      success: true,
      page: pageName,
      content: generatedContent,
    });
  } catch (error) {
    console.error("Get page content error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

module.exports = router;

