async function loadAndAnalyze() {
    const res = await fetch('lotto-history.json');
    const data = await res.json();
  
    const freq = Array(45).fill(0);
  
    // 번호 빈도 계산
    data.forEach(draw => {
      draw.numbers.forEach(num => {
        freq[num - 1]++;
      });
    });
  
    const totalDraws = data.length;
    const labels = Array.from({ length: 45 }, (_, i) => (i + 1).toString());
    const percentages = freq.map(count => ((count / totalDraws) * 100).toFixed(1));
  
    // 번호별 색상 분류
    function getColor(num) {
      if (num <= 10) return '#fbc02d'; // 노랑
      if (num <= 20) return '#1976d2'; // 파랑
      if (num <= 30) return '#d32f2f'; // 빨강
      if (num <= 40) return '#616161'; // 회색
      return '#388e3c';                // 초록
    }
  
    const barColors = labels.map(num => getColor(Number(num)));
  
    // 그래프 출력
    const ctx = document.getElementById('freqChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '번호별 출현 횟수',
          data: freq,
          backgroundColor: barColors
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const count = ctx.raw;
                const percent = percentages[ctx.dataIndex];
                return `${count}회 (${percent}%)`;
              }
            }
          },
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#000',
            font: { weight: 'bold' },
            formatter: (value) => value
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: '출현 횟수' },
            ticks: { stepSize: 1 }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  
    // ✅ 분석 요약
    const top6 = [...freq]
      .map((count, i) => ({ num: i + 1, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  
    const minFreq = Math.min(...freq);
    const leastNumbers = freq
      .map((count, i) => ({ num: i + 1, count }))
      .filter(item => item.count === minFreq)
      .map(item => item.num);
  
    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = `
      ✅ 총 분석 회차 수: ${totalDraws}회<br/>
      🏆 가장 많이 나온 번호 TOP 6: 
      <strong>${top6.map(item => item.num).join(', ')}</strong><br/>
      🐢 가장 적게 나온 번호: 
      <strong>${leastNumbers.join(', ')}</strong><br/>
      📊 전체 평균 출현 횟수: 
      <strong>${(freq.reduce((a, b) => a + b, 0) / 45).toFixed(1)}회</strong>
    `;
  
    // ✅ 짝수/홀수 비율
    let oddCount = 0;
    let evenCount = 0;
    data.forEach(draw => {
      draw.numbers.forEach(num => {
        if (num % 2 === 0) evenCount++;
        else oddCount++;
      });
    });
  
    const totalNums = oddCount + evenCount;
    const oddRate = ((oddCount / totalNums) * 100).toFixed(1);
    const evenRate = ((evenCount / totalNums) * 100).toFixed(1);
  
    summaryDiv.innerHTML += `
      <br/><br/>⚖️ 전체 번호 중<br/>
      ➤ 홀수: <strong>${oddCount}개 (${oddRate}%)</strong><br/>
      ➤ 짝수: <strong>${evenCount}개 (${evenRate}%)</strong>
    `;
    const ranges = [
        { label: '1~10', min: 1, max: 10, count: 0 },
        { label: '11~20', min: 11, max: 20, count: 0 },
        { label: '21~30', min: 21, max: 30, count: 0 },
        { label: '31~40', min: 31, max: 40, count: 0 },
        { label: '41~45', min: 41, max: 45, count: 0 }
      ];
      
      // 회차별 번호 돌면서 각 구간별 count 계산
      data.forEach(draw => {
        draw.numbers.forEach(num => {
          const range = ranges.find(r => num >= r.min && num <= r.max);
          if (range) range.count++;
        });
      });
      
      // 전체 수 대비 비율 계산
      const totalNumsInAll = data.length * 6;
      const rangeSummary = ranges.map(r => {
        const percent = ((r.count / totalNumsInAll) * 100).toFixed(1);
        return `${r.label}: <strong>${r.count}개 (${percent}%)</strong>`;
      }).join('<br/>');
      
      // 🔄 요약 박스에 출력
      summaryDiv.innerHTML += `
        <br/><br/>📐 번호 구간별 분포<br/>
        ${rangeSummary}
      `;
      const rangeCtx = document.getElementById('rangeChart').getContext('2d');
      new Chart(rangeCtx, {
        type: 'doughnut',
        data: {
          labels: ranges.map(r => r.label),
          datasets: [{
            data: ranges.map(r => r.count),
            backgroundColor: ['#fbc02d', '#1976d2', '#d32f2f', '#616161', '#388e3c']
          }]
        },
        options: {
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { size: 14 }
              }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const label = ctx.label;
                  const value = ctx.raw;
                  const percent = ((value / totalNumsInAll) * 100).toFixed(1);
                  return `${label}: ${value}개 (${percent}%)`;
                }
              }
            }
          }
        }
      });  
  }
  
  loadAndAnalyze();
  