const express = require("express");
const path = require('path');
const cors = require("cors");
const helmet = require('helmet');
const xss = require('xss');
const routes = require("./route");
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = parseInt(process.env.PORT);

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
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use("/", routes); // 라우팅 로직을 적용
app.use("/api/v1/users", userRoutes);

module.exports = app;