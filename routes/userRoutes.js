const express = require('express');
const userController = require('../controllers/authController');

const router = express.Router();

router.get('/me', userController.getUser);

module.exports = router;