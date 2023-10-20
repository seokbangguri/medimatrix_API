require('dotenv').config({ path: './.env.secret'});
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./route");

const app = express();
const port = parseInt(process.env.PORT);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use("/", routes); // 라우팅 로직을 적용

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
