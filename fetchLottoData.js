const axios = require('axios');
const fs = require('fs');

const START = 1050;
const END = 1112;

async function getLottoData(round) {
  const url = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`;
  const res = await axios.get(url);
  return res.data;
}

(async () => {
  const results = [];

  for (let i = START; i <= END; i++) {
    console.log(`📦 ${i}회차 수집 중...`);
    const data = await getLottoData(i);
    if (data.returnValue === 'success') {
      results.push({
        round: data.drwNo,
        date: data.drwNoDate,
        numbers: [
          data.drwtNo1, data.drwtNo2, data.drwtNo3,
          data.drwtNo4, data.drwtNo5, data.drwtNo6,
        ],
        bonus: data.bnusNo,
      });
    }
  }

  fs.writeFileSync('lotto-history.json', JSON.stringify(results, null, 2), 'utf-8');
  console.log(`✅ 완료! 총 ${results.length}개 회차 저장됨`);
})();