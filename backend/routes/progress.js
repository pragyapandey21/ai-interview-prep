// backend/routes/progress.js
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const protect = require('../middleware/authMiddleware');

// ── GET /api/progress  — load this user's progress from MongoDB ───────────────
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      'completedQuestions quizScore mockScore hrScore currentStreak longestStreak lastActiveDate'
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({
      completedQuestions: user.completedQuestions || {
        DSA: [], DBMS: [], 'Operating System': [], 'Computer Networks': [], 'HR Interview': []
      },
      quizScore:     user.quizScore     || 0,
      mockScore:     user.mockScore     || 0,
      hrScore:       user.hrScore       || 0,
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0,
    });
  } catch (err) {
    console.error('GET /api/progress error:', err);
    res.status(500).json({ message: 'Failed to load progress.' });
  }
});

// ── POST /api/progress/save  — save completedQuestions to MongoDB ─────────────
// Body: { completedQuestions: { DSA: [0,1], DBMS: [], ... } }
router.post('/save', protect, async (req, res) => {
  try {
    const { completedQuestions } = req.body;
    if (!completedQuestions || typeof completedQuestions !== 'object') {
      return res.status(400).json({ message: 'Invalid data.' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.completedQuestions = completedQuestions;

    // ── Update streak ─────────────────────────────────────────────────────────
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (!user.lastActiveDate) {
      user.currentStreak = 1; user.longestStreak = 1; user.lastActiveDate = today;
    } else {
      const last = new Date(user.lastActiveDate); last.setHours(0, 0, 0, 0);
      const diff = Math.floor((today - last) / 86400000);
      if (diff === 1) {
        user.currentStreak += 1;
        if (user.currentStreak > user.longestStreak) user.longestStreak = user.currentStreak;
        user.lastActiveDate = today;
      } else if (diff > 1) {
        user.currentStreak = 1; user.lastActiveDate = today;
      }
    }

    // ── CRITICAL: mark completedQuestions as modified (needed for Object type) ─
    user.markModified('completedQuestions');
    await user.save();

    res.json({
      message:            'Progress saved.',
      completedQuestions: user.completedQuestions,
      currentStreak:      user.currentStreak,
      longestStreak:      user.longestStreak,
    });
  } catch (err) {
    console.error('POST /api/progress/save error:', err);
    res.status(500).json({ message: 'Failed to save progress.' });
  }
});

// ── POST /api/progress/quiz  — save quiz score ────────────────────────────────
router.post('/quiz', protect, async (req, res) => {
  try {
    const { score } = req.body;
    await User.findByIdAndUpdate(req.userId, { quizScore: score });
    res.json({ message: 'Quiz score saved.', quizScore: score });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save quiz score.' });
  }
});

// ── POST /api/progress/mock  — save mock interview score ──────────────────────
router.post('/mock', protect, async (req, res) => {
  try {
    const { score } = req.body;
    await User.findByIdAndUpdate(req.userId, { mockScore: score });
    res.json({ message: 'Mock score saved.', mockScore: score });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save mock score.' });
  }
});

module.exports = router;