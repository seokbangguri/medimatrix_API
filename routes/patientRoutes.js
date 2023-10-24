const express = require('express');

const router = express.Router();

const patientController = require('../controllers/patientController');

router.post('/patientexist', patientController.patientE);
router.post('/patientlist', patientController.patientL);
router.post('/patientdata', patientController.loadPatientData);

module.exports = router;
