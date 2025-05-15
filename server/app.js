const express = require('express');
const cors = require('cors');
const lottoRoute = require('./routes/lotto');

const app = express();
const PORT = 3000;

app.use(cors());
app.use('/api/lotto', lottoRoute);

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});