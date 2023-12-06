const express = require('express');

const router = express.Router();

const spermController = require('../controllers/spermController');

router.post('/spermVideos', spermController.SpermVideosAnalyze);
router.get('/getChromosome', spermController.getChromosome);
router.get('/getInfertility', spermController.getInfertility);

module.exports = router;
