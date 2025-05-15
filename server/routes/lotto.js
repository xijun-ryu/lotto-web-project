const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const round = req.query.round;

  if (!round) {
    return res.status(400).json({ error: '회차 정보가 필요합니다. (?round=1112)' });
  }

  try {
    const response = await axios.get(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '로또 데이터 불러오기 실패' });
  }
});

module.exports = router;