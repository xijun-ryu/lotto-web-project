function getBallColor(num) {
    if (num <= 10) return '#fbc02d';    // 노랑
    if (num <= 20) return '#1976d2';    // 파랑
    if (num <= 30) return '#d32f2f';    // 빨강
    if (num <= 40) return '#616161';    // 회색
    return '#388e3c';                   // 초록
  }
  
  async function fetchLotto() {
    const round = document.getElementById('round-input').value;
    const result = document.getElementById('result');
  
    if (!round) {
      alert('회차 번호를 입력해주세요!');
      return;
    }
  
    try {
      const res = await fetch(`https://lotto-web-project.onrender.com/api/lotto?round=${round}`);
      const data = await res.json();
  
      if (data.returnValue !== 'success') {
        result.innerHTML = `<p style="color:red;">해당 회차 번호는 존재하지 않습니다.</p>`;
        return;
      }
  
      const numbers = [
        data.drwtNo1, data.drwtNo2, data.drwtNo3,
        data.drwtNo4, data.drwtNo5, data.drwtNo6
      ];
  
      const balls = numbers
        .map(num => `<span class="ball" style="background-color: ${getBallColor(num)}">${num}</span>`)
        .join('');
  
      const bonusBall = `<span class="ball" style="background-color: ${getBallColor(data.bnusNo)}">${data.bnusNo}</span>`;
  
      result.innerHTML = `
        <h2>${data.drwNo}회 (${data.drwNoDate})</h2>
        <div>${balls} + ${bonusBall}</div>
      `;
    } catch (err) {
      console.error(err);
      result.innerHTML = `<p style="color:red;">데이터를 불러오는 데 실패했습니다.</p>`;
    }
  }