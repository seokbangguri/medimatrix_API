const express = require('express');

const router = express.Router();

const spermController = require('../controllers/spermController');


router.post('/spermVideos', spermController.SpermVideosAnalyze);
router.post('/getChromosome', spermController.getChromosome);
router.post('/getInfertility', spermController.getInfertility);

module.exports = router;