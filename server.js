const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

dotenv.config();

const connectDB = require('./config/db');
const { logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/v1/user/login', authLimiter);
app.use('/api/v1/user/signup', authLimiter);

app.get('/health', (req, res) => {
  logEvent('Health check endpoint pinged', 'INFO');
  res.status(200).json({
    success: true,
    status: 'UP',
    message: 'Server is operational and running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/user', authRoutes);
app.use('/api/v1/emp', employeeRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server.`
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});