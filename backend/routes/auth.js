const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ==========================================================================
// 📝 1. USER REGISTRATION / SIGN-UP ROUTE
// ==========================================================================
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Sanity Check: Does the user profile already exist?
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Student account with this email already exists!" });
    }

    // Secure Hashing: Encrypt the password completely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save New Profile Structure to Atlas Cloud
    // In your signup route, when creating the user:
const user = new User({
  name,
  email,
  password: hashedPassword,
  role:   req.body.role   || "Software Developer",
  skills: req.body.skills || ["JavaScript"],
});

    await user.save();

    // Sign Session JSON Web Token Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });

  } catch (err) {
    console.error("Sign-up Error Loop Failure:", err);
    res.status(500).json({ message: "Server encountered a structural login registry error." });
  }
});

// ==========================================================================
// 🔑 2. USER LOGIN / VALIDATION ROUTE
// ==========================================================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check email existence parameters
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials. Account not found!" });
    }

    // 2. Check encrypted hash passwords match parameters
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password credentials combination!" });
    }

    // 3. Issue Token and pass current user progress back to React safely!
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        completedQuestions: user.completedQuestions || {
          "DSA": [], "DBMS": [], "Operating System": [], "Computer Networks": [], "HR Interview": []
        },
        quizScore: user.quizScore || 0,
        mockScore: user.mockScore || 0,
        hrScore: user.hrScore || 0
      }
    });

  } catch (err) {
    console.error("Login Handler Error Failure:", err);
    res.status(500).json({ message: "Internal server error loop tripped." });
  }
});
module.exports = router;