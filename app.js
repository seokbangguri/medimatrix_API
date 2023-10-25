const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
// const xss = require("xss");
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const viewRooutes = require('./routes/viewRoutes');
const spermRoutes = require('.routes/spermRoutes');

const app = express();

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
  console.error(err);
  res.status(500).send('Something broke!');
});

// Routes
app.use('/', viewRooutes); // 라우팅 로직을 적용
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/python/v1/sperm', spermRoutes);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
  next();
});

module.exports = app;
