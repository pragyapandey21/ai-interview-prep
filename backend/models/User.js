// backend/models/User.js
const mongoose = require('mongoose');

// Activity log entry schema
const ActivitySchema = new mongoose.Schema({
  type:      { type: String, required: true },   // mock_completed | quiz_completed | hr_completed | topic_studied | feedback_received
  label:     { type: String, required: true },   // human-readable: "Completed Mock Interview"
  score:     { type: Number, default: null },     // score if applicable
  topic:     { type: String, default: null },     // topic if applicable
  timestamp: { type: Date,   default: Date.now },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },

  // ── Progress: Object type (not Map) — serialises cleanly to JSON ──────────
  completedQuestions: {
    type: Object,
    default: {
      "DSA": [], "DBMS": [], "Operating System": [], "Computer Networks": [], "HR Interview": []
    }
  },

  // ── Scores ────────────────────────────────────────────────────────────────
  quizScore: { type: Number, default: 0 },
  mockScore: { type: Number, default: 0 },
  hrScore:   { type: Number, default: 0 },

  // ── Streak ────────────────────────────────────────────────────────────────
  currentStreak:  { type: Number, default: 0 },
  longestStreak:  { type: Number, default: 0 },
  lastActiveDate: { type: Date,   default: null },

  // ── Activity log (last 50 actions) ────────────────────────────────────────
  activityLog: { type: [ActivitySchema], default: [] },

  // ── Profile ───────────────────────────────────────────────────────────────
  skills: { type: [String], default: ['React.js', 'Node.js', 'JavaScript', 'MongoDB'] },
  role:   { type: String,   default: 'Frontend & Full-Stack Developer' },

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);