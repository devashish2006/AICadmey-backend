// routes/authRoutes.js
const express = require('express');
const { login } = require('../controllers/authController');
const { registerUser } = require('../controllers/authController');
const {getCurrentUser} = require('../controllers/authController');
const authMiddleware = require('../authMiddleware');



const router = express.Router();
//login Route
router.post('/login', login);

// Signup Route
router.post("/signup", registerUser);

// Get current logged in user
// router.get("/me",authMiddleware, getCurrentUser);
module.exports = router;
