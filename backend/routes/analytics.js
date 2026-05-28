// backend/routes/analytics.js
// Handles: activity feed, practice sessions, feedback scores, dashboard stats
// Place at: backend/routes/analytics.js

const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const protect = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/analytics/dashboard
// Returns everything the dashboard needs in one call
// ─────────────────────────────────────────────────────────────────────────────
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Compute practice sessions and feedback received from activity log
    const practiceSessions = (user.activityLog || []).filter(a =>
      ['mock_completed','quiz_completed','practice_completed'].includes(a.type)
    ).length;

    const feedbackReceived = (user.activityLog || []).filter(a =>
      a.type === 'feedback_received'
    ).length;

    res.json({
      practiceSessions,
      feedbackReceived,
      currentStreak:  user.currentStreak  || 0,
      longestStreak:  user.longestStreak  || 0,
      mockScore:      user.mockScore      || 0,
      quizScore:      user.quizScore      || 0,
      hrScore:        user.hrScore        || 0,
      recentActivity: (user.activityLog || []).slice(-8).reverse(), // last 8, newest first
    });
  } catch (err) {
    console.error('GET /api/analytics/dashboard error:', err);
    res.status(500).json({ message: 'Failed to load dashboard data.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/analytics/feedback
// Returns real feedback analytics for the Feedback page
// ─────────────────────────────────────────────────────────────────────────────
router.get('/feedback', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const log = user.activityLog || [];

    // Get latest mock score from activity log (fallback to stored score)
    const mockEntries = log.filter(a => a.type === 'mock_completed');
    const latestMock  = mockEntries.length > 0
      ? mockEntries[mockEntries.length - 1]
      : null;

    // Get latest quiz score
    const quizEntries = log.filter(a => a.type === 'quiz_completed');
    const latestQuiz  = quizEntries.length > 0
      ? quizEntries[quizEntries.length - 1]
      : null;

    // HR score from hr practice sessions
    const hrEntries  = log.filter(a => a.type === 'hr_completed');
    const latestHR   = hrEntries.length > 0
      ? hrEntries[hrEntries.length - 1]
      : null;

    res.json({
      technical: {
        score:        latestMock ? latestMock.score : user.mockScore || null,
        maxScore:     10,
        sessionCount: mockEntries.length,
        lastUpdated:  latestMock ? latestMock.timestamp : null,
      },
      behavioral: {
        score:        latestHR ? latestHR.score : user.hrScore || null,
        maxScore:     10,
        sessionCount: hrEntries.length,
        lastUpdated:  latestHR ? latestHR.timestamp : null,
      },
      coreConcepts: {
        score:        latestQuiz ? latestQuiz.score : (user.quizScore > 0 ? user.quizScore : null),
        maxScore:     4,
        sessionCount: quizEntries.length,
        lastUpdated:  latestQuiz ? latestQuiz.timestamp : null,
      },
    });
  } catch (err) {
    console.error('GET /api/analytics/feedback error:', err);
    res.status(500).json({ message: 'Failed to load feedback data.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/analytics/activity
// Log a user activity (mock completed, quiz done, topic studied, etc.)
// Body: { type, label, score?, topic? }
// Types: mock_completed | quiz_completed | hr_completed | topic_studied | feedback_received
// ─────────────────────────────────────────────────────────────────────────────
router.post('/activity', protect, async (req, res) => {
  try {
    const { type, label, score, topic } = req.body;
    if (!type || !label) return res.status(400).json({ message: 'type and label required.' });

    const entry = {
      type,
      label,
      score:     score  ?? null,
      topic:     topic  || null,
      timestamp: new Date(),
    };

    await User.findByIdAndUpdate(
      req.userId,
      { $push: { activityLog: { $each: [entry], $slice: -50 } } }, // keep last 50
      { new: true }
    );

    // Also update the relevant score field
    const scoreUpdate = {};
    if (type === 'mock_completed' && score != null) scoreUpdate.mockScore = score;
    if (type === 'quiz_completed' && score != null) scoreUpdate.quizScore = score;
    if (type === 'hr_completed'   && score != null) scoreUpdate.hrScore   = score;

    if (Object.keys(scoreUpdate).length > 0) {
      await User.findByIdAndUpdate(req.userId, scoreUpdate);
    }

    res.json({ message: 'Activity logged.', entry });
  } catch (err) {
    console.error('POST /api/analytics/activity error:', err);
    res.status(500).json({ message: 'Failed to log activity.' });
  }
});

module.exports = router;