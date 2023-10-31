const express = require('express');

const router = express.Router();

const spermController = require('../controllers/spermController');


router.post('/spermVideos', spermController.SpermVideosAnalyze);

module.exports = router;