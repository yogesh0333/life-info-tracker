/**
 * Astrological calculations based on date of birth
 */

/**
 * Calculate Life Path Number from date of birth
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @returns {number} Life Path Number (1-9)
 */
function calculateLifePath(dob) {
  const date = new Date(dob);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Reduce day, month, year to single digits
  function reduceToSingleDigit(num) {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = num
        .toString()
        .split("")
        .reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
  }

  const reducedDay = reduceToSingleDigit(day);
  const reducedMonth = reduceToSingleDigit(month);
  const reducedYear = reduceToSingleDigit(year);

  // Sum and reduce to single digit
  let lifePath = reducedDay + reducedMonth + reducedYear;
  lifePath = reduceToSingleDigit(lifePath);

  return lifePath;
}

/**
 * Calculate Birth Date Number (day of birth reduced)
 * @param {string} dob - Date of birth
 * @returns {number} Birth Date Number
 */
function calculateBirthNumber(dob) {
  const date = new Date(dob);
  const day = date.getDate();
  
  function reduceToSingleDigit(num) {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = num
        .toString()
        .split("")
        .reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
  }

  return reduceToSingleDigit(day);
}

/**
 * Get Zodiac Sign from date of birth
 * @param {string} dob - Date of birth
 * @returns {string} Zodiac sign
 */
function getZodiacSign(dob) {
  const date = new Date(dob);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

/**
 * Get Planetary Ruler based on Life Path Number
 * @param {number} lifePath - Life Path Number
 * @returns {object} Planetary information
 */
function getPlanetaryRuler(lifePath) {
  const rulers = {
    1: { planet: "Sun", archetype: "The Leader", energy: "Leadership, confidence, authority" },
    2: { planet: "Moon", archetype: "The Diplomat", energy: "Cooperation, intuition, harmony" },
    3: { planet: "Jupiter", archetype: "The Sovereign Magician", energy: "Expansion, wisdom, calm authority, masterful expression" },
    4: { planet: "Saturn", archetype: "The Builder", energy: "Structure, discipline, practicality" },
    5: { planet: "Mercury", archetype: "The Communicator", energy: "Communication, adaptability, intelligence" },
    6: { planet: "Venus", archetype: "The Nurturer", energy: "Love, beauty, harmony, service" },
    7: { planet: "Ketu", archetype: "The Seeker", energy: "Spirituality, introspection, wisdom" },
    8: { planet: "Saturn", archetype: "The Authority", energy: "Power, transformation, material success" },
    9: { planet: "Mars", archetype: "The Warrior", energy: "Courage, action, determination" },
  };

  return rulers[lifePath] || rulers[3];
}

/**
 * Generate complete astrological profile
 * @param {string} dob - Date of birth
 * @param {string} tob - Time of birth (optional)
 * @param {string} pob - Place of birth (optional)
 * @returns {object} Complete astrological profile
 */
function generateAstrologicalProfile(dob, tob = null, pob = null) {
  const lifePath = calculateLifePath(dob);
  const birthNumber = calculateBirthNumber(dob);
  const zodiacSign = getZodiacSign(dob);
  const planetaryRuler = getPlanetaryRuler(lifePath);

  return {
    lifePath,
    birthNumber,
    zodiacSign,
    planetaryRuler,
    ascendant: "Virgo", // Default, can be calculated with proper astrology library
    mahadasha: "Mercury", // Default, needs proper calculation
    coreVibration: planetaryRuler.energy,
    archetype: planetaryRuler.archetype,
  };
}

module.exports = {
  calculateLifePath,
  calculateBirthNumber,
  getZodiacSign,
  getPlanetaryRuler,
  generateAstrologicalProfile,
};

