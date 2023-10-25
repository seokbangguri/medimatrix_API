const express = require('express');
const spermController = require('../controllers/spermController');

const router = express.Router();

router.get('/testpython', spermController.pythonVideo);
