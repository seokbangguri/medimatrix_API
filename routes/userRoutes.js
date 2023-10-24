const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/me', userController.getUser);

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/setting', userController.loadUserData);
router.get('/getAllTherapist', userController.gellAllTherapists);
router.post('/updateUserData', userController.updateData);
router.post('/updatePassword', authController.updatePassword);

module.exports = router;
