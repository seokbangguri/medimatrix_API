const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const { spawn } = require('child_process');
// const ffmpeg = require('fluent-ffmpeg');
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
    return res.status(400).send('파일이 업로드되지 않았습니다.');
  }

  const uploadedFile = req.files.file;

  // 사용자가 업로드한 파일의 확장자를 확인
  const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();

  // 지원하는 동영상 확장자 목록
  const supportedVideoFormats = ['mp4', 'avi', 'mov', 'mkv', /* 기타 지원하는 확장자들 */];

  // 지원하는 동영상 확장자인지 확인
  if (supportedVideoFormats.includes(fileExtension)) {
    // 동영상 파일의 포맷이 올바르다면 Python 스크립트 호출
    const pythonFilePath = './testVideo.py';
    const AImodule1 = spawn('python3', [pythonFilePath], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    AImodule1.stdin.write(uploadedFile.data);
    AImodule1.stdin.end();

    AImodule1.stdout.on('data', (data) => {
      console.log(data.toString('utf-8'));
      res.status(200).send(JSON.parse(data));
    });
  } else {
    res.status(400).send('지원하지 않는 비디오 포맷입니다.');
  }
});


app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
  next();
});


module.exports = app;
