const express = require('express');

const router = express.Router();

const patientController = require('../controllers/patientController');

router.post('/patientexist', patientController.patientE);
router.get('/patientlist', patientController.patientL);
router.get('/patientdata', patientController.loadPatientData);

module.exports = router;
