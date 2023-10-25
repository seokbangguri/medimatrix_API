const express = require('express');
const { spawn } = require('child_process');
const spermController = require('../controllers/spermController');

const router = express.Router();

router.post('/testpython', 
    async function pythonVideo(req, res) {
    if (!req.files || !req.files.file) {
      return res.status(400).send('No files were uploaded.');
    }
  
    const uploadedFile = req.files.file;
    const pythonFilePath = '/home/vmadmin/python/testVideo.py';

    // Python 스크립트 호출
    const pythonProcess = spawn('python', [ pythonFilePath, uploadedFile]);
  
    // Python 스크립트의 출력을 응답으로 전송
    pythonProcess.stdout.on('data', (data) => {
      res.send(data.toString());
    });
});

module.exports = router;