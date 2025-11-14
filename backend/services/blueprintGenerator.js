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
    const prompt = `Generate a comprehensive career blueprint for ${userProfile.name} (Age: ${userProfile.age}, Life Path: ${userProfile.astrology.lifePath}, Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}, Archetype: "${userProfile.astrology.archetype}"):

CRITICAL: Return ONLY valid JSON. No markdown, no explanations outside JSON.

REQUIRED JSON STRUCTURE:
{
  "currentStatus": {
    "currentRole": "Full Stack Developer",
    "currentSalary": "₹24 LPA",
    "currentCompany": "Current company",
    "experience": "X years",
    "skills": ["React", "Node.js", "MongoDB"]
  },
  "careerPaths": [
    {
      "pathName": "FAANG/Product Companies",
      "pros": ["High salary", "Great brand", "Learning opportunities"],
      "cons": ["High competition", "Work pressure"],
      "requiredSkills": ["System design", "DSA", "Leadership"],
      "targetSalary": "₹40-60 LPA",
      "timeline": "2027-2028",
      "companies": ["Google", "Microsoft", "Amazon", "Flipkart"],
      "astrologicalAlignment": "Jupiter period favors growth"
    },
    {
      "pathName": "Freelancing/Consulting",
      "pros": ["Flexibility", "Higher rates", "Own schedule"],
      "cons": ["Income uncertainty", "No benefits"],
      "requiredSkills": ["Client management", "Portfolio building"],
      "targetIncome": "₹10-20 LPA",
      "timeline": "2026-2027",
      "astrologicalAlignment": "Mercury favors communication"
    },
    {
      "pathName": "Startup/Entrepreneurship",
      "pros": ["Ownership", "High potential", "Creative freedom"],
      "cons": ["High risk", "Long hours", "Financial uncertainty"],
      "requiredSkills": ["Business acumen", "Product thinking", "Networking"],
      "targetIncome": "₹50+ LPA",
      "timeline": "2028-2030",
      "astrologicalAlignment": "Mars energy for risk-taking"
    }
  ],
  "recommendedPath": {
    "path": "Combined: Job + Side Business",
    "reason": "Balanced approach with security and growth potential",
    "strategy": "Work in FAANG/Product company while building side business"
  },
  "skillDevelopment": {
    "dailySchedule": {
      "morning": "6:00 AM - 7:00 AM: Study/Code",
      "evening": "7:00 PM - 9:00 PM: Practice/Projects"
    },
    "weeklySchedule": {
      "weekdays": "Focus on current job skills and system design",
      "weekends": "Learn new technologies, build portfolio projects"
    },
    "skillsToLearn": [
      {
        "skill": "System Design",
        "priority": "High",
        "timeline": "6 months",
        "resources": ["Books", "Online courses", "Practice"]
      }
    ]
  },
  "financialProjections": [
    {
      "age": 29,
      "year": 2025,
      "salary": "₹24 LPA",
      "role": "Developer"
    },
    {
      "age": 31,
      "year": 2027,
      "salary": "₹40 LPA",
      "role": "Lead Developer"
    }
  ],
  "sacrifices": ["Social time", "Entertainment", "Comfort zone"],
  "successMetrics": {
    "shortTerm": ["Complete 2 advanced courses", "Build 3 portfolio projects"],
    "longTerm": ["Reach ₹40 LPA", "Get lead developer role"]
  },
  "immediateActions": [
    "Update resume with latest projects",
    "Start system design course",
    "Build 2-3 portfolio projects",
    "Network with industry professionals"
  ],
  "astrologicalAlignment": {
    "bestPeriod": "2027-2030",
    "favorablePlanets": "Jupiter, Mercury",
    "remedies": ["Worship Jupiter on Thursdays", "Wear yellow sapphire"]
  }
}

Generate detailed, actionable career plan based on their astrological profile. Be specific with Indian job market context.`;

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
    const prompt = `Generate a comprehensive health and fitness blueprint for ${userProfile.name} (Age: ${userProfile.age}, Life Path: ${userProfile.astrology.lifePath}, Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}):

CRITICAL: Return ONLY valid JSON. No markdown, no explanations outside JSON.

REQUIRED JSON STRUCTURE:
{
  "currentStatus": {
    "currentWeight": "X kg",
    "height": "X'X\"",
    "bmi": "X",
    "targetWeight": "X kg",
    "timeline": "12 months"
  },
  "weightLossTimeline": [
    {
      "month": "Nov 2025",
      "weight": "91 kg",
      "loss": "Start",
      "status": "Obese"
    },
    {
      "month": "Jan 2026",
      "weight": "84 kg",
      "loss": "-7 kg",
      "status": "Overweight"
    }
  ],
  "mealPlan": {
    "dailyCalories": 1800,
    "breakfast": {
      "time": "7:00 AM",
      "calories": 400,
      "items": ["Oats (50g) + milk + banana + almonds", "Green tea"]
    },
    "lunch": {
      "time": "1:00 PM",
      "calories": 500,
      "items": ["Roti (2) + dal + sabzi + salad + curd"]
    },
    "dinner": {
      "time": "7:30 PM",
      "calories": 400,
      "items": ["Roti (2) + dal + sabzi + salad"]
    },
    "snacks": [
      {
        "time": "10:30 AM",
        "calories": 150,
        "items": ["Apple + almonds (5-6)"]
      }
    ]
  },
  "exercisePlan": {
    "weeklySchedule": [
      {
        "day": "Monday",
        "morning": "Cardio (Walk 40min)",
        "evening": "Strength (Upper)"
      }
    ],
    "cardio": {
      "duration": "40 min",
      "activities": ["Brisk walk: 30 min", "Light jog: 10 min"],
      "targetHeartRate": "120-140 bpm"
    },
    "strength": {
      "upperBody": ["Push-ups: 3×15", "Tricep dips: 3×15"],
      "lowerBody": ["Squats: 3×20", "Lunges: 3×12"],
      "fullBody": ["Burpees: 3×10", "Mountain climbers: 3×20"]
    },
    "yoga": {
      "frequency": "3 times/week",
      "asanas": ["Surya Namaskar", "Pranayama"]
    }
  },
  "foodsToAvoid": ["Fast food", "Fried items", "Sweets", "Soft drinks"],
  "supplements": [
    {
      "name": "Vitamin D",
      "dosage": "1000 IU",
      "timing": "Morning"
    }
  ],
  "healthPredictions": {
    "criticalPeriods": ["2027-2028: Health challenges", "Remedies needed"],
    "planetaryInfluences": "Saturn in 7th house affects health"
  },
  "bestTimes": {
    "workout": "6:00 AM (Sunrise)",
    "meals": "Fixed timings as per plan"
  },
  "actionPlan": {
    "month1": ["Start with walking", "Follow meal plan"],
    "month3": ["Add strength training", "Increase cardio"],
    "month6": ["Full routine", "Track progress"]
  }
}

Generate detailed, actionable health plan based on their astrological profile.`;

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
    const gender = userProfile.gender || "male";
    const isMarried = userProfile.age >= 28; // Assume married if 28+

    const prompt = `Generate comprehensive family planning recommendations for ${
      userProfile.name
    } (Age: ${userProfile.age}, Gender: ${gender}, Life Path: ${
      userProfile.astrology.lifePath
    }, Planetary Ruler: ${
      userProfile.astrology.planetaryRuler.planet
    }, Mahadasha: ${userProfile.astrology.mahadasha}):

CRITICAL: Return ONLY valid JSON. No markdown, no explanations outside JSON.

REQUIRED JSON STRUCTURE:
{
  "marriageStatus": "${isMarried ? "Married" : "Not Married"}",
  "marriageTiming": {
    "bestPeriod": "2027-2029",
    "bestMonths": ["November 2027", "February 2028", "May 2028"],
    "auspiciousDates": ["Specific dates with nakshatras"],
    "astrologicalReasons": "Mercury-Venus period, Jupiter transits"
  },
  "conceptionPlan": {
    "bestTimes": [
      {
        "year": 2026,
        "months": ["March", "June", "September"],
        "astrologicalReasons": "Favorable planetary positions"
      }
    ],
    "remedies": [
      "Worship Lord Shiva and Parvati",
      "Chant 'Om Namah Shivaya' 108 times daily",
      "Donate white clothes and milk on Mondays"
    ],
    "vastuRecommendations": {
      "bedroomDirection": "Southwest",
      "bedPosition": "Head towards South",
      "colors": "Pink, white, light blue"
    }
  },
  "childrenPlan": {
    "timeline": [
      {
        "childNumber": 1,
        "conceptionYear": 2026,
        "birthYear": 2027,
        "ageWhenBorn": 31,
        "bestMonths": ["March", "June"]
      },
      {
        "childNumber": 2,
        "conceptionYear": 2029,
        "birthYear": 2030,
        "ageWhenBorn": 34,
        "bestMonths": ["April", "July"]
      }
    ],
    "remediesForHealthyChildren": [
      "Worship Lord Ganesha daily",
      "Chant 'Om Ganeshaya Namah' 108 times",
      "Donate sweets to children on Wednesdays"
    ]
  },
  "familyGifts": {
    "forWife": [
      {
        "item": "Gold jewelry",
        "astrologicalReason": "Venus rules marriage",
        "bestTime": "Friday"
      }
    ],
    "forChildren": [
      {
        "item": "Silver items",
        "astrologicalReason": "Moon rules children",
        "bestTime": "Monday"
      }
    ],
    "forParents": [
      {
        "item": "Clothes, food",
        "astrologicalReason": "Jupiter rules parents",
        "bestTime": "Thursday"
      }
    ]
  },
  "familyHarmony": {
    "recommendations": [
      "Daily family prayer",
      "Celebrate festivals together",
      "Respect elders"
    ],
    "remedies": [
      "Worship Lord Vishnu and Lakshmi",
      "Keep Tulsi plant at home",
      "Donate food to needy"
    ]
  },
  "vastuRecommendations": {
    "bedroom": {
      "direction": "Southwest",
      "colors": "Pink, white",
      "items": "Avoid mirrors facing bed"
    },
    "pujaRoom": {
      "direction": "Northeast",
      "deities": "Family deities"
    }
  },
  "spiritualPractices": {
    "daily": ["Morning prayer", "Evening aarti"],
    "weekly": ["Family satsang", "Visit temple"]
  }
}

Generate detailed family planning based on their astrological profile. If already married, focus on children planning.`;

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
    const prompt = `Generate a comprehensive financial blueprint for ${userProfile.name} (Age: ${userProfile.age}, Life Path: ${userProfile.astrology.lifePath}, Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}):

CRITICAL: Return ONLY valid JSON. No markdown, no explanations outside JSON.

REQUIRED JSON STRUCTURE:
{
  "currentStatus": {
    "currentSalary": "₹X LPA",
    "monthlyIncome": "₹X Lakhs",
    "currentSavings": "₹X Lakhs/month",
    "currentNetWorth": "₹X Lakhs",
    "savingsRate": "X%"
  },
  "incomeTrajectory": [
    {
      "age": 29,
      "year": 2025,
      "jobIncome": "₹24 LPA",
      "businessIncome": "₹3 LPA",
      "investmentIncome": "₹0",
      "totalIncome": "₹27 LPA",
      "netWorth": "₹12 Lakhs",
      "role": "Developer",
      "milestone": "Current"
    }
  ],
  "investmentStrategy": {
    "stocks": {
      "allocation": "X%",
      "recommendations": ["Large cap funds", "Mid cap funds"],
      "monthlyInvestment": "₹X",
      "target": "₹X by age 60"
    },
    "mutualFunds": {
      "allocation": "X%",
      "recommendations": ["SIP recommendations"],
      "monthlyInvestment": "₹X"
    },
    "realEstate": {
      "allocation": "X%",
      "recommendations": ["When to buy", "Location suggestions"],
      "targetYear": 2030
    },
    "gold": {
      "allocation": "X%",
      "monthlyInvestment": "₹X"
    },
    "emergencyFund": {
      "target": "6 months expenses",
      "amount": "₹X Lakhs"
    }
  },
  "netWorthMilestones": [
    {
      "age": 30,
      "year": 2026,
      "target": "₹35 Lakhs",
      "milestone": "First major milestone"
    }
  ],
  "financialRemedies": {
    "daan": ["Items to donate", "Best days"],
    "puja": ["Lakshmi puja", "Kuber yantra"],
    "gemstones": ["Yellow sapphire for Jupiter", "Diamond for Venus"],
    "vastu": ["North direction for wealth", "Kuber yantra placement"]
  },
  "budgetPlan": {
    "monthlyIncome": "₹X",
    "expenses": {
      "housing": "₹X",
      "food": "₹X",
      "transport": "₹X",
      "lifestyle": "₹X",
      "savings": "₹X"
    },
    "savingsTarget": "50% of income"
  },
  "bestTimes": {
    "majorInvestments": "Jupiter transits, auspicious dates",
    "propertyPurchase": "2027-2028",
    "businessStart": "2026-2027"
  },
  "targetNetWorth": {
    "age60": "₹75 Crores",
    "age50": "₹35 Crores",
    "age40": "₹9 Crores"
  }
}

Generate detailed, realistic projections based on their astrological profile. Include specific numbers, dates, and actionable recommendations.`;

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
    const prompt = `Generate comprehensive Vastu Shastra recommendations for ${userProfile.name} (Life Path: ${userProfile.astrology.lifePath}, Planetary Ruler: ${userProfile.astrology.planetaryRuler.planet}, Zodiac: ${userProfile.astrology.zodiacSign}):

CRITICAL: Return ONLY valid JSON. No markdown, no explanations outside JSON.

REQUIRED JSON STRUCTURE:
{
  "vastuMandala": {
    "northeast": {
      "element": "Water",
      "planet": "Jupiter",
      "purpose": "Puja room, God's place",
      "recommendations": ["Keep clean", "Place idols", "No toilet"]
    },
    "north": {
      "element": "Air",
      "planet": "Mercury",
      "purpose": "Wealth, main door",
      "recommendations": ["Main door here", "Place Kuber yantra"]
    },
    "southwest": {
      "element": "Earth",
      "planet": "Rahu",
      "purpose": "Master bedroom",
      "recommendations": ["Heavy furniture", "Head towards South"]
    },
    "southeast": {
      "element": "Fire",
      "planet": "Venus",
      "purpose": "Kitchen",
      "recommendations": ["Stove facing East", "No toilet nearby"]
    }
  },
  "wealthVastu": {
    "mainDoor": {
      "bestDirections": ["North", "East", "Northeast"],
      "avoid": ["South", "Southwest"],
      "recommendations": ["Clean entrance", "Place nameplate", "No obstacles"]
    },
    "treasury": {
      "direction": "North",
      "recommendations": ["Place safe here", "Keep Kuber yantra", "No clutter"]
    },
    "remedies": [
      "Place Kuber yantra in North",
      "Keep money plant in North",
      "Donate to poor regularly"
    ]
  },
  "childrenVastu": {
    "bedroom": {
      "direction": "Southwest",
      "bedPosition": "Head towards South",
      "colors": ["Pink", "White", "Light blue"],
      "avoid": ["Mirrors facing bed", "Toilet attached", "Sharp objects"]
    },
    "remedies": [
      "Place Ganesha idol in bedroom",
      "Keep fresh flowers",
      "Worship daily"
    ]
  },
  "peaceVastu": {
    "livingRoom": {
      "direction": "North or East",
      "recommendations": ["Keep clean", "Natural light", "Family photos"]
    },
    "pujaRoom": {
      "direction": "Northeast",
      "recommendations": ["Clean daily", "Light diya", "Place idols properly"]
    },
    "remedies": [
      "Keep Tulsi plant",
      "Play soft music",
      "Avoid negative energy"
    ]
  },
  "vehicleVastu": {
    "parking": {
      "direction": "North or East",
      "avoid": ["Southwest", "Southeast"],
      "recommendations": ["Clean parking area", "No obstacles"]
    },
    "remedies": [
      "Worship vehicle on festivals",
      "Keep Ganesha idol in vehicle",
      "Donate to transport workers"
    ]
  },
  "homeChecklist": {
    "beforeBuying": [
      "Check direction of main door",
      "Verify no toilet in Northeast",
      "Check for Vastu defects"
    ],
    "bestDirections": {
      "mainDoor": ["North", "East", "Northeast"],
      "bedroom": ["Southwest"],
      "kitchen": ["Southeast"],
      "pujaRoom": ["Northeast"]
    }
  },
  "colorRecommendations": {
    "bedroom": ["Pink", "White", "Light blue"],
    "livingRoom": ["Yellow", "Green", "White"],
    "kitchen": ["Yellow", "Orange", "Red"],
    "pujaRoom": ["White", "Yellow", "Saffron"]
  },
  "remedies": {
    "forWealth": ["Place Kuber yantra", "Donate regularly", "Keep North clean"],
    "forChildren": ["Worship Ganesha", "Keep bedroom clean", "Place Ganesha idol"],
    "forPeace": ["Keep Tulsi", "Daily puja", "Positive energy"]
  }
}

Generate detailed Vastu recommendations based on their astrological profile.`;

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
