require('dotenv').config({ path: './.env' });

const app = require('./app');

const port = process.env.PORT || 8000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
