const express = require('express');
const { register, login, logout } = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public routes (no auth required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (auth required)
router.post('/logout', auth, logout);

module.exports = router;