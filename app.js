const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const { spawn } = require('child_process');
// const xss = require("xss");
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const viewRooutes = require('./routes/viewRoutes');
// const spermRoutes = require('.routes/spermRoutes');

const fileUpload = require('express-fileupload');
const app = express();
app.use(fileUpload());

// Middlewares
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Body parser, reading data form body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization agains XXS
// app.use(xss());

app.use(cors());

app.use((err, req, res, next) => {
  res.status(500).send('Something broke!');
});

// Routes
app.use('/', viewRooutes); // 라우팅 로직을 적용
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/patients', patientRoutes);
// app.use('/python/v1/sperm', spermRoutes);

app.post('/test', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No files were uploaded.');
  }

  const pythonFilePath = './testVideo.py';
  const uploadedFile = req.files.file;

  // Python 스크립트 호출
  const pythonProcess = spawn('python3', [ pythonFilePath ], {
    stdio: ['pipe', 'pipe', 'pipe', 'ipc']
  });

  // 동영상 파일 데이터를 Python 스크립트로 전송
  pythonProcess.stdin.write(uploadedFile.data);
  pythonProcess.stdin.end();
  // Python 스크립트의 출력을 응답으로 전송
  pythonProcess.stdout.on('data', (data) => {
    res.send(data.toString());
  });
});

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
  next();
});


module.exports = app;
