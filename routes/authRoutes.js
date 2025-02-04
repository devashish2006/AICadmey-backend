// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { registerUser } = require('../controllers/authController');

//login Route
router.post('/login', login);

// Signup Route
router.post("/signup", registerUser);

module.exports = router;
