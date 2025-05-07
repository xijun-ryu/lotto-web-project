// js/generate.js

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  }
  
  function getBallColor(num) {
    if (num <= 10) return '#fbc02d';    // 노랑
    if (num <= 20) return '#1976d2';    // 파랑
    if (num <= 30) return '#d32f2f';    // 빨강
    if (num <= 40) return '#616161';    // 회색
    return '#388e3c';                   // 초록
  }
  
  function displayLottoSets() {
    const container = document.getElementById('lotto-container');
    container.innerHTML = ''; // 새로고침 시 초기화
    for (let i = 0; i < 5; i++) {
      const set = generateLottoNumbers();
      const div = document.createElement('div');
      div.innerHTML = set
        .map(num => `<span class="ball" style="background-color: ${getBallColor(num)};">${num}</span>`)
        .join('');
      container.appendChild(div);
    }
  }
  
  window.onload = displayLottoSets;