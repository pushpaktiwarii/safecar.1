const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { initDb } = require('./db/init');

// Initialize DB
initDb();

const app = express();

app.use(cors({
    origin: true, // Allow all origins dynamically (for local dev loopback + network)
    credentials: true
}));

// Request Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body && Object.keys(req.body).length ? req.body : '');
    next();
});
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', msg: 'Aidlyn API is running' }));

// TODO: Routes
const authRoutes = require('./routes/auth');
const ownerRoutes = require('./routes/owner');
const publicRoutes = require('./routes/public');

app.use('/api/auth', authRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/public', publicRoutes);

module.exports = app;
