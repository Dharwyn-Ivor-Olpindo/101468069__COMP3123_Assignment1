const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { logEvent } = require('../middleware/logger');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this username or email.'
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    logEvent(`New user registered: ${username}`, 'AUTH');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide credentials (username or email, plus password).'
      });
    }

    const query = username ? { username } : { email };
    const user = await User.findOne(query);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      logEvent(`Failed login attempt for: ${username || email}`, 'SECURITY');
      return res.status(401).json({
        success: false,
        message: 'Invalid login credentials.'
      });
    }

    const token = generateToken(user._id);
    logEvent(`User logged in: ${user.username}`, 'AUTH');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login };