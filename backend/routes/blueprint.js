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

    // Check which pages have content
    const pagesStatus = {};
    const allPages = user.blueprint.pages || [];
    allPages.forEach((page) => {
      pagesStatus[page] = !!contentObj[page];
    });

    res.json({
      success: true,
      blueprint: {
        generated: user.blueprint.generated,
        generatedAt: user.blueprint.generatedAt,
        pages: user.blueprint.pages,
        pagesStatus, // Which pages have content
        astrology: user.astrology,
        content: contentObj, // AI-generated content
        userInfo: {
          name: user.name,
          email: user.email,
          dob: user.dob ? user.dob.toISOString().split("T")[0] : null,
          gender: user.gender,
        },
      },
    });
  } catch (error) {
    console.error("Get blueprint error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// @route   POST /api/blueprint/generate/:pageName
// @desc    Generate AI content for a specific page
// @access  Private
router.post("/generate/:pageName", auth, async (req, res) => {
  const startTime = Date.now();
  const { pageName } = req.params;

  try {
    console.log(`[GENERATE] Starting generation for page: ${pageName}`);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const blueprintGenerator = require("../services/blueprintGenerator");
    const userProfile = {
      name: user.name,
      dob: user.dob.toISOString().split("T")[0],
      age: Math.floor((new Date() - user.dob) / (365.25 * 24 * 60 * 60 * 1000)),
      astrology: user.astrology,
      gender: user.gender,
    };

    console.log(
      `[GENERATE] User profile: ${user.name}, Life Path: ${user.astrology?.lifePath}`
    );

    let generatedContent;
    switch (pageName) {
      case "career":
        console.log(`[GENERATE] Calling generateCareerContent...`);
        generatedContent = await blueprintGenerator.generateCareerContent(
          userProfile
        );
        break;
      case "lifestyle":
        console.log(`[GENERATE] Calling generateLifestyleContent...`);
        generatedContent = await blueprintGenerator.generateLifestyleContent(
          userProfile
        );
        break;
      case "health":
        console.log(`[GENERATE] Calling generateHealthContent...`);
        generatedContent = await blueprintGenerator.generateHealthContent(
          userProfile
        );
        break;
      case "family":
        console.log(`[GENERATE] Calling generateFamilyContent...`);
        generatedContent = await blueprintGenerator.generateFamilyContent(
          userProfile
        );
        break;
      case "finance":
        console.log(`[GENERATE] Calling generateFinanceContent...`);
        generatedContent = await blueprintGenerator.generateFinanceContent(
          userProfile
        );
        break;
      case "spiritual":
        console.log(`[GENERATE] Calling generateSpiritualContent...`);
        generatedContent = await blueprintGenerator.generateSpiritualContent(
          userProfile
        );
        break;
      case "remedies":
        console.log(`[GENERATE] Calling generateRemediesContent...`);
        generatedContent = await blueprintGenerator.generateRemediesContent(
          userProfile
        );
        break;
      case "vastu":
        console.log(`[GENERATE] Calling generateVastuContent...`);
        generatedContent = await blueprintGenerator.generateVastuContent(
          userProfile
        );
        break;
      case "past-karma":
        console.log(`[GENERATE] Calling generatePastKarmaContent...`);
        generatedContent = await blueprintGenerator.generatePastKarmaContent(
          userProfile
        );
        break;
      case "medical-astrology":
        console.log(`[GENERATE] Calling generateMedicalAstrologyContent...`);
        generatedContent =
          await blueprintGenerator.generateMedicalAstrologyContent(userProfile);
        break;
      case "pilgrimage":
        console.log(`[GENERATE] Calling generatePilgrimageContent...`);
        generatedContent = await blueprintGenerator.generatePilgrimageContent(
          userProfile
        );
        break;
      default:
        return res
          .status(404)
          .json({ error: "Page not found", page: pageName });
    }

    console.log(`[GENERATE] Content generated successfully for ${pageName}`);

    // Save generated content
    if (!user.blueprint.content) {
      user.blueprint.content = new Map();
    }
    user.blueprint.content.set(pageName, generatedContent);
    user.blueprint.generated = true;
    await user.save();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[GENERATE] Completed ${pageName} in ${duration}s`);

    res.json({
      success: true,
      message: `${pageName} content generated successfully`,
      page: pageName,
      content: generatedContent,
      duration: `${duration}s`,
    });
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(
      `[GENERATE] Error generating ${pageName} after ${duration}s:`,
      error
    );
    console.error(`[GENERATE] Error stack:`, error.stack);

    res.status(500).json({
      error: "Server error",
      message: error.message,
      page: pageName,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// @route   POST /api/blueprint/generate-all
// @desc    Generate AI content for all pages
// @access  Private
router.post("/generate-all", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Start generation in background (don't wait)
    const blueprintGenerator = require("../services/blueprintGenerator");

    // Generate all content
    blueprintGenerator
      .generateBlueprint(user)
      .then((content) => {
        user.blueprint.content = content;
        user.blueprint.generated = true;
        user
          .save()
          .catch((err) => console.error("Error saving blueprint:", err));
      })
      .catch((err) => {
        console.error("Error generating blueprint:", err);
      });

    res.json({
      success: true,
      message:
        "Blueprint generation started. Content will be available shortly.",
      status: "generating",
    });
  } catch (error) {
    console.error("Generate all error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
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

    if (!content) {
      return res.status(404).json({
        error: "Content not generated yet",
        page: pageName,
        generated: false,
      });
    }

    res.json({
      success: true,
      page: pageName,
      content,
      generated: true,
    });
  } catch (error) {
    console.error("Get page content error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
});

module.exports = router;
