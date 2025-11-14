/**
 * AI-Powered Blueprint Generator
 * Generates personalized content for each user based on their astrological profile
 */

const aiService = require("./aiService");

class BlueprintGenerator {
  /**
   * Generate complete blueprint content for a user
   */
  async generateBlueprint(user) {
    const userProfile = {
      name: user.name,
      dob: user.dob.toISOString().split("T")[0],
      age: this.calculateAge(user.dob),
      astrology: user.astrology,
      gender: user.gender,
    };

    const blueprint = {
      career: await this.generateCareerContent(userProfile),
      lifestyle: await this.generateLifestyleContent(userProfile),
      health: await this.generateHealthContent(userProfile),
      family: await this.generateFamilyContent(userProfile),
      finance: await this.generateFinanceContent(userProfile),
      spiritual: await this.generateSpiritualContent(userProfile),
      remedies: await this.generateRemediesContent(userProfile),
      vastu: await this.generateVastuContent(userProfile),
      medicalAstrology: await this.generateMedicalAstrologyContent(userProfile),
      pilgrimage: await this.generatePilgrimageContent(userProfile),
    };

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
- Core Vibration: ${userProfile.astrology.coreVibration}
- Zodiac Sign: ${userProfile.astrology.zodiacSign}
- Current Age: ${userProfile.age}

REQUIREMENTS:
1. Career paths aligned with their Life Path and Planetary energy
2. Specific job roles and industries that match their astrological profile
3. Career growth timeline (next 5 years)
4. Skills to develop
5. Best times for job changes or promotions
6. Salary trajectory based on their planetary influences
7. Work environment recommendations
8. Daily/weekly career action plan

Format as structured JSON with sections: careerPaths, timeline, skills, actionPlan, salaryProjection.

Be specific, practical, and aligned with Indian job market and astrological principles.`;

    const systemPrompt = `You are an expert career counselor and Vedic astrologer. Provide detailed, personalized career guidance based on astrological profiles. Focus on practical, actionable advice for the Indian job market.`;

    try {
      const response = await aiService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.8,
        maxTokens: 3000,
      });

      // Try to parse JSON, if fails return as text
      try {
        return JSON.parse(response.content);
      } catch (parseError) {
        // If not JSON, return as structured text
        return {
          raw: response.content,
          formatted: true,
        };
      }
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
    const prompt = `Generate a comprehensive lifestyle blueprint for ${userProfile.name}:

ASTROLOGICAL PROFILE:
- Life Path Number: ${userProfile.astrology.lifePath}
- Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}
- Archetype: ${userProfile.astrology.archetype}
- Core Vibration: ${userProfile.astrology.coreVibration}
- Zodiac Sign: ${userProfile.astrology.zodiacSign}

REQUIREMENTS:
1. Brand recommendations (watches, accessories, clothing) aligned with their planetary energy
2. Fragrance recommendations (EDP, EDT, Attar) based on their Life Path and archetype
3. Color palette recommendations
4. Style guidelines (minimalist, classy, grounded - matching their core vibration)
5. Budget-friendly options (under ₹3,000 for fragrances)
6. Occasion-based recommendations (office, parties, weddings, gym, home)
7. Brand analysis: Design Philosophy, Quality, Aura, Energetic Alignment
8. Specific product recommendations with prices and astrological scores

Format as structured JSON with sections: accessories, fragrances, clothing, colors, styleGuide.

Focus on brands that amplify their "${userProfile.astrology.archetype}" aura.`;

    const systemPrompt = `You are a lifestyle consultant specializing in astrological brand alignment. Recommend brands and products that energetically align with the user's planetary ruler and archetype. Focus on quality, authenticity, and "quiet luxury" that matches their core vibration.`;

    try {
      const response = await aiService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.8,
        maxTokens: 4000,
      });
      return JSON.parse(response.content);
    } catch (error) {
      console.error("Error generating lifestyle content:", error);
      return { error: "Failed to generate lifestyle content" };
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
- Current Age: ${userProfile.age}
- Gender: ${userProfile.gender}

REQUIREMENTS:
1. Weight loss/gain plan based on planetary influences
2. Daily meal plan aligned with their zodiac sign
3. Exercise routine matching their planetary energy
4. Supplements and vitamins recommendations
5. Health predictions based on their chart
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
      });
      return JSON.parse(response.content);
    } catch (error) {
      console.error("Error generating health content:", error);
      return { error: "Failed to generate health content" };
    }
  }

  /**
   * Generate Family Content
   */
  async generateFamilyContent(userProfile) {
    const prompt = `Generate a comprehensive family planning blueprint for ${userProfile.name}:

ASTROLOGICAL PROFILE:
- Life Path Number: ${userProfile.astrology.lifePath}
- Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}
- Zodiac Sign: ${userProfile.astrology.zodiacSign}
- Current Age: ${userProfile.age}
- Gender: ${userProfile.gender}

REQUIREMENTS:
1. Best times for child conception based on their chart
2. Number of children recommended astrologically
3. Remedies for healthy pregnancy and children
4. Partner compatibility insights
5. Family planning timeline
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
      });
      return JSON.parse(response.content);
    } catch (error) {
      console.error("Error generating family content:", error);
      return { error: "Failed to generate family content" };
    }
  }

  /**
   * Generate Finance Content
   */
  async generateFinanceContent(userProfile) {
    const prompt = `Generate a comprehensive financial blueprint for ${userProfile.name}:

ASTROLOGICAL PROFILE:
- Life Path Number: ${userProfile.astrology.lifePath}
- Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}
- Zodiac Sign: ${userProfile.astrology.zodiacSign}
- Current Age: ${userProfile.age}

REQUIREMENTS:
1. Income trajectory based on planetary influences
2. Investment strategy aligned with their Life Path
3. Best investment types (stocks, real estate, gold, etc.)
4. Financial milestones and timeline
5. Wealth-building plan
6. Remedies for financial growth
7. Best times for major financial decisions
8. Monthly budget recommendations

Format as structured JSON with sections: incomeTrajectory, investmentStrategy, milestones, remedies, budgetPlan.`;

    const systemPrompt = `You are a financial advisor with expertise in Vedic astrology and wealth management. Provide personalized financial planning based on astrological profiles.`;

    try {
      const response = await aiService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 3000,
      });
      return JSON.parse(response.content);
    } catch (error) {
      console.error("Error generating finance content:", error);
      return { error: "Failed to generate finance content" };
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
      });
      return JSON.parse(response.content);
    } catch (error) {
      console.error("Error generating spiritual content:", error);
      return { error: "Failed to generate spiritual content" };
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
      });
      return JSON.parse(response.content);
    } catch (error) {
      console.error("Error generating remedies content:", error);
      return { error: "Failed to generate remedies content" };
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
      });
      return JSON.parse(response.content);
    } catch (error) {
      console.error("Error generating vastu content:", error);
      return { error: "Failed to generate vastu content" };
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
- Current Age: ${userProfile.age}

REQUIREMENTS:
1. Planetary health influences
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
      });
      return JSON.parse(response.content);
    } catch (error) {
      console.error("Error generating medical astrology content:", error);
      return { error: "Failed to generate medical astrology content" };
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
      });
      return JSON.parse(response.content);
    } catch (error) {
      console.error("Error generating pilgrimage content:", error);
      return { error: "Failed to generate pilgrimage content" };
    }
  }
}

module.exports = new BlueprintGenerator();
