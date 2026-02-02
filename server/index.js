const express = require('express');
const cors = require('cors');
require('dotenv').config();
const initDb = require('./initDb');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ SIMPLE CORS (allow frontend + all for now)
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/stats', statsRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Expense Tracker API Running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ✅ Start server after DB init
const startServer = async () => {
  try {
    await initDb();
    console.log("Database connected successfully");

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Database init failed:", err);
    process.exit(1);
  }
};

startServer();
