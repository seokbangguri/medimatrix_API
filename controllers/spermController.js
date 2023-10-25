const fileUpload = require('express-fileupload');
const { spawn } = require('child_process');

async function pythonVideo(req, res) {
    if (!req.files || !req.files.file) {
      return res.status(400).send('No files were uploaded.');
    }
  
    const uploadedFile = req.files.file;

    // Python 스크립트 호출
    const pythonProcess = spawn('python', ['your_python_script.py', uploadedFile]);
  
    // Python 스크립트의 출력을 응답으로 전송
    pythonProcess.stdout.on('data', (data) => {
      res.send(data.toString());
    });
}