/**
 * Input Validation Middleware
 */

const { sanitizeInput } = require("../utils/dbHelpers");

/**
 * Validate email format
 */
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate date format (YYYY-MM-DD)
 */
const validateDate = (dateString) => {
  const re = /^\d{4}-\d{2}-\d{2}$/;
  if (!re.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Validate time format (HH:MM)
 */
const validateTime = (timeString) => {
  const re = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return re.test(timeString);
};

/**
 * Validate registration input
 */
const validateRegister = (req, res, next) => {
  const { name, email, password, dob } = req.body;

  // Required fields
  if (!name || !email || !password || !dob) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["name", "email", "password", "dob"],
    });
  }

  // Validate email
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate password
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  // Validate date
  if (!validateDate(dob)) {
    return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
  }

  // Validate time of birth if provided
  if (req.body.tob && !validateTime(req.body.tob)) {
    return res.status(400).json({ error: "Invalid time format. Use HH:MM" });
  }

  // Sanitize inputs
  req.body.name = sanitizeInput(name, "string");
  req.body.email = sanitizeInput(email, "email");
  req.body.pob = req.body.pob ? sanitizeInput(req.body.pob, "string") : null;

  next();
};

/**
 * Validate login input
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  req.body.email = sanitizeInput(email, "email");

  next();
};

/**
 * Validate daily log input
 */
const validateDailyLog = (req, res, next) => {
  const { category, activity } = req.body;

  if (!category || !activity) {
    return res.status(400).json({ error: "Category and activity are required" });
  }

  const validCategories = [
    "career",
    "health",
    "finance",
    "family",
    "spiritual",
    "lifestyle",
    "learning",
    "other",
  ];

  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  // Sanitize
  req.body.activity = sanitizeInput(activity, "string");
  req.body.description = req.body.description
    ? sanitizeInput(req.body.description, "string")
    : null;

  next();
};

/**
 * Validate goal input
 */
const validateGoal = (req, res, next) => {
  const { category, title } = req.body;

  if (!category || !title) {
    return res.status(400).json({ error: "Category and title are required" });
  }

  const validCategories = [
    "career",
    "health",
    "finance",
    "family",
    "spiritual",
    "lifestyle",
    "learning",
    "other",
  ];

  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  // Sanitize
  req.body.title = sanitizeInput(title, "string");
  req.body.description = req.body.description
    ? sanitizeInput(req.body.description, "string")
    : null;

  next();
};

module.exports = {
  validateEmail,
  validateDate,
  validateTime,
  validateRegister,
  validateLogin,
  validateDailyLog,
  validateGoal,
};

