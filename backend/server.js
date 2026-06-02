// backend/server.js
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ai-interview-prep-gold.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/progress',  require('./routes/progress'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/ai',        require('./routes/ai'));        // ← ADD THIS LINE

app.get('/api/test', (req, res) => res.json({ message: 'Backend running! 🚀' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas connected!'))
  .catch(err  => console.error('❌ MongoDB failed:', err));

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`✅ Server on port ${PORT}`));