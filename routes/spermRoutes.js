const express = require('express');
const spermController = require('../controllers/spermController');

const router = express.Router();

router.post('/testpython', spermController.pythonVideo);

module.exports = router;