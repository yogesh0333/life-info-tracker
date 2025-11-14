const aiService = require("./aiService");

/**
 * Helper function to clean and parse JSON from AI response
 */
function parseAIResponse(content) {
  try {
    // Clean the response content - remove markdown code blocks if present
    let cleanedContent = content.trim();

    // Remove markdown code blocks (```json ... ``` or ``` ... ```)
    if (cleanedContent.startsWith("```")) {
      // Find the first newline after opening ```
      const firstNewline = cleanedContent.indexOf("\n");
      if (firstNewline !== -1) {
        cleanedContent = cleanedContent.substring(firstNewline + 1);
      } else {
        cleanedContent = cleanedContent.substring(3); // Remove ``` if no newline
      }

      // Remove closing ```
      const lastBacktick = cleanedContent.lastIndexOf("```");
      if (lastBacktick !== -1) {
        cleanedContent = cleanedContent.substring(0, lastBacktick).trim();
      }
    }

    return JSON.parse(cleanedContent);
  } catch (parseError) {
    // If not JSON, return as structured text
    console.warn(`Failed to parse JSON:`, parseError.message);
    return {
      raw: content,
      formatted: true,
    };
  }
}

class BlueprintGenerator {
  /**
   * Generate complete blueprint for user
   */
  async generateBlueprint(user) {
    const userProfile = {
      name: user.name,
      dob: user.dob.toISOString().split("T")[0],
      age: this.calculateAge(user.dob),
      astrology: user.astrology,
      gender: user.gender,
    };

    const blueprint = new Map();

    blueprint.set("career", await this.generateCareerContent(userProfile));
    blueprint.set(
      "lifestyle",
      await this.generateLifestyleContent(userProfile)
    );
    blueprint.set("health", await this.generateHealthContent(userProfile));
    blueprint.set("family", await this.generateFamilyContent(userProfile));
    blueprint.set("finance", await this.generateFinanceContent(userProfile));
    blueprint.set(
      "spiritual",
      await this.generateSpiritualContent(userProfile)
    );
    blueprint.set("remedies", await this.generateRemediesContent(userProfile));
    blueprint.set("vastu", await this.generateVastuContent(userProfile));
    blueprint.set(
      "past-karma",
      await this.generatePastKarmaContent(userProfile)
    );
    blueprint.set(
      "medical-astrology",
      await this.generateMedicalAstrologyContent(userProfile)
    );
    blueprint.set(
      "pilgrimage",
      await this.generatePilgrimageContent(userProfile)
    );

    return blueprint;
  }

  calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  /**
   * Generate Career Content
   */
  async generateCareerContent(userProfile) {
    const prompt = `Generate a comprehensive career blueprint for ${userProfile.name}:

ASTROLOGICAL PROFILE:
- Life Path Number: ${userProfile.astrology.lifePath}
- Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}
- Archetype: ${userProfile.astrology.archetype}
- Zodiac Sign: ${userProfile.astrology.zodiacSign}
- Age: ${userProfile.age}

REQUIREMENTS:
1. Current Status (current salary, target salary, timeline)
2. Three distinct career paths to achieve significant growth (e.g., FAANG, Freelancing, Startup), detailing pros, cons, and required skills for each.
3. A recommended combined path.
4. Daily and weekly schedules for skill development.
5. Financial projections and sacrifices needed.
6. Key success metrics and immediate actions.
7. Astrological alignment for career choices.

Be specific, practical, and aligned with Indian job market and astrological principles.`;

    const systemPrompt = `You are an expert career counselor and Vedic astrologer. Provide detailed, personalized career guidance based on astrological profiles. Focus on practical, actionable advice for the Indian job market.`;

    try {
      const response = await aiService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.8,
        maxTokens: 3000,
        provider: process.env.DEFAULT_AI_PROVIDER || "openai",
      });

      return parseAIResponse(response.content);
    } catch (error) {
      console.error("Error generating career content:", error);
      return {
        error: "Failed to generate career content",
        message: error.message,
      };
    }
  }

  /**
   * Generate Lifestyle Content
   */
  async generateLifestyleContent(userProfile) {
    const gender = userProfile.gender || "male";
    const genderContext =
      gender === "male" ? "MALE" : gender === "female" ? "FEMALE" : "UNISEX";

    const prompt = `Generate comprehensive lifestyle recommendations for ${userProfile.name}:

CRITICAL: USER IS ${genderContext} - ALL RECOMMENDATIONS MUST BE FOR ${genderContext} PRODUCTS ONLY. DO NOT RECOMMEND PRODUCTS FOR THE OPPOSITE GENDER.

ASTROLOGICAL PROFILE:
- Life Path Number: ${userProfile.astrology.lifePath}
- Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}
- Archetype: ${userProfile.astrology.archetype}
- Core Vibration: ${userProfile.astrology.coreVibration}
- Zodiac Sign: ${userProfile.astrology.zodiacSign}
- Gender: ${genderContext}

REQUIREMENTS:
1. Brand recommendations (watches, accessories, clothing) aligned with their planetary energy - FOR ${genderContext} ONLY
2. Fragrance recommendations (EDP, EDT, Attar) based on their Life Path and archetype - ${genderContext} FRAGRANCES ONLY (men's fragrances if male, women's if female)
3. Color palette recommendations
4. Style guidelines (minimalist, classy, grounded - matching their core vibration)
5. Budget-friendly options (under ₹3,000 for fragrances)
6. Occasion-based recommendations (office, parties, weddings, gym, home)
7. Leather briefcase recommendations aligned with astrology/numerology

IMPORTANT: 
- If gender is MALE: Recommend men's fragrances, men's clothing, men's accessories
- If gender is FEMALE: Recommend women's fragrances, women's clothing, women's accessories
- NEVER mix genders in recommendations

Format as structured JSON with sections: accessories, fragrances, clothing, colors, styleGuide.

Focus on brands that amplify their "${userProfile.astrology.archetype}" aura for a ${genderContext} user.`;

    const systemPrompt = `You are a lifestyle consultant specializing in astrological brand alignment. Recommend brands and products that energetically align with the user's planetary ruler and archetype. Focus on quality, authenticity, and "quiet luxury" that matches their core vibration.`;

    try {
      const response = await aiService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.8,
        maxTokens: 4000,
        provider: process.env.DEFAULT_AI_PROVIDER || "openai",
      });

      return parseAIResponse(response.content);
    } catch (error) {
      console.error("Error generating lifestyle content:", error);
      return {
        error: "Failed to generate lifestyle content",
        message: error.message,
      };
    }
  }

  /**
   * Generate Health Content
   */
  async generateHealthContent(userProfile) {
    const prompt = `Generate a comprehensive health and fitness blueprint for ${userProfile.name}:

ASTROLOGICAL PROFILE:
- Life Path Number: ${userProfile.astrology.lifePath}
- Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}
- Zodiac Sign: ${userProfile.astrology.zodiacSign}
- Age: ${userProfile.age}

REQUIREMENTS:
1. Weight loss/gain plan based on current and target weight
2. Daily meal plans (breakfast, lunch, dinner, snacks)
3. Exercise routines (cardio, strength, yoga)
4. Supplements recommendations
5. Health predictions based on astrological chart
6. Best times for workouts and meals
7. Foods to avoid based on astrological profile
8. 90-day action plan

Format as structured JSON with sections: mealPlan, exercisePlan, supplements, healthPredictions, actionPlan.`;

    const systemPrompt = `You are a health and fitness expert with knowledge of Ayurveda and medical astrology. Provide personalized health recommendations based on astrological profiles.`;

    try {
      const response = await aiService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 3000,
        provider: process.env.DEFAULT_AI_PROVIDER || "openai",
      });

      return parseAIResponse(response.content);
    } catch (error) {
      console.error("Error generating health content:", error);
      return {
        error: "Failed to generate health content",
        message: error.message,
      };
    }
  }

  /**
   * Generate Family Content
   */
  async generateFamilyContent(userProfile) {
    const prompt = `Generate family planning recommendations for ${userProfile.name}:

ASTROLOGICAL PROFILE:
- Life Path Number: ${userProfile.astrology.lifePath}
- Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}
- Zodiac Sign: ${userProfile.astrology.zodiacSign}
- Mahadasha: ${userProfile.astrology.mahadasha}

REQUIREMENTS:
1. Child conception plan (best times, remedies)
2. Children timeline (when to have children)
3. Remedies for healthy children
4. Astrological gifts for family members
5. Family harmony recommendations
6. Remedies for family harmony
7. Vastu recommendations for bedroom (conception)
8. Spiritual practices for family well-being

Format as structured JSON with sections: conceptionPlan, childrenPlan, remedies, timeline, vastuRecommendations.`;

    const systemPrompt = `You are an expert in family planning, Vedic astrology, and spiritual remedies. Provide detailed guidance for family planning based on astrological charts.`;

    try {
      const response = await aiService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 3000,
        provider: process.env.DEFAULT_AI_PROVIDER || "openai",
      });

      return parseAIResponse(response.content);
    } catch (error) {
      console.error("Error generating family content:", error);
      return {
        error: "Failed to generate family content",
        message: error.message,
      };
    }
  }

  /**
   * Generate Finance Content
   */
  async generateFinanceContent(userProfile) {
    const prompt = `Generate financial planning recommendations for ${userProfile.name}:

ASTROLOGICAL PROFILE:
- Life Path Number: ${userProfile.astrology.lifePath}
- Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}
- Zodiac Sign: ${userProfile.astrology.zodiacSign}
- Mahadasha: ${userProfile.astrology.mahadasha}

REQUIREMENTS:
1. Income trajectory (current to target)
2. Investment strategy (stocks, mutual funds, real estate, gold)
3. Net worth milestones
4. Financial remedies (Daan, puja, gemstones)
5. Best times for major financial decisions
6. Monthly budget recommendations

Format as structured JSON with sections: incomeTrajectory, investmentStrategy, milestones, remedies, budgetPlan.`;

    const systemPrompt = `You are a financial advisor with expertise in Vedic astrology and wealth management. Provide personalized financial planning based on astrological profiles.`;

    try {
      const response = await aiService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 3000,
        provider: process.env.DEFAULT_AI_PROVIDER || "openai",
      });

      return parseAIResponse(response.content);
    } catch (error) {
      console.error("Error generating finance content:", error);
      return {
        error: "Failed to generate finance content",
        message: error.message,
      };
    }
  }

  /**
   * Generate Spiritual Content
   */
  async generateSpiritualContent(userProfile) {
    const prompt = `Generate a comprehensive spiritual blueprint for ${userProfile.name}:

ASTROLOGICAL PROFILE:
- Life Path Number: ${userProfile.astrology.lifePath}
- Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}
- Archetype: ${userProfile.astrology.archetype}
- Zodiac Sign: ${userProfile.astrology.zodiacSign}
- Mahadasha: ${userProfile.astrology.mahadasha}

REQUIREMENTS:
1. Deity worship recommendations (based on planetary ruler)
2. Daily spiritual practices
3. Mantras and prayers specific to their chart
4. Gemstone recommendations
5. Puja rituals and timing
6. Spiritual remedies for life challenges
7. Protection items (rudraksha, yantras)
8. Best times for spiritual practices

Format as structured JSON with sections: deityWorship, dailyPractices, mantras, gemstones, remedies, protectionItems.`;

    const systemPrompt = `You are a spiritual guide and Vedic astrology expert. Provide detailed spiritual practices and remedies based on astrological charts.`;

    try {
      const response = await aiService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 3000,
        provider: process.env.DEFAULT_AI_PROVIDER || "openai",
      });

      return parseAIResponse(response.content);
    } catch (error) {
      console.error("Error generating spiritual content:", error);
      return {
        error: "Failed to generate spiritual content",
        message: error.message,
      };
    }
  }

  /**
   * Generate Remedies Content
   */
  async generateRemediesContent(userProfile) {
    const prompt = `Generate comprehensive astrological remedies for ${userProfile.name}:

ASTROLOGICAL PROFILE:
- Life Path Number: ${userProfile.astrology.lifePath}
- Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}
- Mahadasha: ${userProfile.astrology.mahadasha}
- Zodiac Sign: ${userProfile.astrology.zodiacSign}

REQUIREMENTS:
1. Remedies by Dasha periods
2. Remedies by life areas (Money, Career, Children, Health, Home)
3. Complete Daan (charity) schedule
4. Astrological gifts for family members
5. Specific remedies for their planetary influences
6. Timing for performing remedies

Format as structured JSON with sections: dashaRemedies, lifeAreaRemedies, daanSchedule, familyGifts.`;

    const systemPrompt = `You are an expert in Vedic astrology remedies and spiritual practices. Provide detailed remedies based on astrological charts.`;

    try {
      const response = await aiService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 3000,
        provider: process.env.DEFAULT_AI_PROVIDER || "openai",
      });

      return parseAIResponse(response.content);
    } catch (error) {
      console.error("Error generating remedies content:", error);
      return {
        error: "Failed to generate remedies content",
        message: error.message,
      };
    }
  }

  /**
   * Generate Vastu Content
   */
  async generateVastuContent(userProfile) {
    const prompt = `Generate Vastu Shastra recommendations for ${userProfile.name}:

ASTROLOGICAL PROFILE:
- Life Path Number: ${userProfile.astrology.lifePath}
- Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}
- Zodiac Sign: ${userProfile.astrology.zodiacSign}

REQUIREMENTS:
1. Vastu for wealth
2. Vastu for children/conception (bedroom)
3. Vastu for peace and harmony
4. Vastu for vehicles and safe travel
5. Home buying checklist
6. Direction recommendations
7. Color recommendations for rooms

Format as structured JSON with sections: wealthVastu, childrenVastu, peaceVastu, vehicleVastu, homeChecklist.`;

    const systemPrompt = `You are a Vastu Shastra expert. Provide detailed Vastu recommendations based on astrological profiles.`;

    try {
      const response = await aiService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 3000,
        provider: process.env.DEFAULT_AI_PROVIDER || "openai",
      });

      return parseAIResponse(response.content);
    } catch (error) {
      console.error("Error generating vastu content:", error);
      return {
        error: "Failed to generate vastu content",
        message: error.message,
      };
    }
  }

  /**
   * Generate Medical Astrology Content
   */
  async generateMedicalAstrologyContent(userProfile) {
    const prompt = `Generate medical astrology predictions for ${userProfile.name}:

ASTROLOGICAL PROFILE:
- Life Path Number: ${userProfile.astrology.lifePath}
- Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}
- Zodiac Sign: ${userProfile.astrology.zodiacSign}
- Mahadasha: ${userProfile.astrology.mahadasha}

REQUIREMENTS:
1. Planetary influences on health
2. Critical health periods by Dasha
3. Medical test schedule
4. Health predictions
5. Preventive measures
6. Foods and lifestyle for health

Format as structured JSON with sections: planetaryInfluences, criticalPeriods, testSchedule, predictions, preventiveMeasures.`;

    const systemPrompt = `You are a medical astrology expert. Provide health predictions and recommendations based on astrological charts.`;

    try {
      const response = await aiService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 3000,
        provider: process.env.DEFAULT_AI_PROVIDER || "openai",
      });

      return parseAIResponse(response.content);
    } catch (error) {
      console.error("Error generating medical astrology content:", error);
      return {
        error: "Failed to generate medical astrology content",
        message: error.message,
      };
    }
  }

  /**
   * Generate Past Karma Content
   */
  async generatePastKarmaContent(userProfile) {
    const prompt = `Generate past karma remedies and strategic gifting recommendations for ${userProfile.name}:

ASTROLOGICAL PROFILE:
- Life Path Number: ${userProfile.astrology.lifePath}
- Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}
- Zodiac Sign: ${userProfile.astrology.zodiacSign}
- Mahadasha: ${userProfile.astrology.mahadasha}

REQUIREMENTS:
1. Strategic gifting for friends (by planet type)
2. Service-based karma clearing activities
3. Pitru Dosha remedies
4. Karma clearing rituals
5. Specific gifts for different planetary influences
6. Timing for karma clearing activities

Format as structured JSON with sections: strategicGifting, serviceActivities, pitruRemedies, rituals, timing.`;

    const systemPrompt = `You are an expert in Vedic astrology and karma clearing. Provide personalized past karma remedies and strategic gifting recommendations based on astrological charts.`;

    try {
      const response = await aiService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 3000,
        provider: process.env.DEFAULT_AI_PROVIDER || "openai",
      });

      return parseAIResponse(response.content);
    } catch (error) {
      console.error("Error generating past karma content:", error);
      return {
        error: "Failed to generate past karma content",
        message: error.message,
      };
    }
  }

  /**
   * Generate Pilgrimage Content
   */
  async generatePilgrimageContent(userProfile) {
    const prompt = `Generate pilgrimage recommendations for ${userProfile.name}:

ASTROLOGICAL PROFILE:
- Life Path Number: ${userProfile.astrology.lifePath}
- Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}
- Zodiac Sign: ${userProfile.astrology.zodiacSign}
- Mahadasha: ${userProfile.astrology.mahadasha}

REQUIREMENTS:
1. Critical priority temple visits
2. Temples by life goals (children, wealth, health)
3. 5-year pilgrimage roadmap
4. Best times to visit each temple
5. Budget estimates
6. Specific prayers and offerings for each temple

Format as structured JSON with sections: priorityVisits, templesByGoal, roadmap, budget.`;

    const systemPrompt = `You are an expert in Hindu pilgrimage sites and Vedic astrology. Provide personalized temple visit recommendations based on astrological charts.`;

    try {
      const response = await aiService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 3000,
        provider: process.env.DEFAULT_AI_PROVIDER || "openai",
      });

      return parseAIResponse(response.content);
    } catch (error) {
      console.error("Error generating pilgrimage content:", error);
      return {
        error: "Failed to generate pilgrimage content",
        message: error.message,
      };
    }
  }
}

module.exports = new BlueprintGenerator();
