const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// 정적 파일 제공 (프로젝트 루트 디렉토리)
app.use(express.static(__dirname));

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 자재 선택 페이지
app.get('/material-selector', (req, res) => {
  res.sendFile(path.join(__dirname, 'material-selector.html'));
});

// 어셈블리 비교 페이지
app.get('/assembly-comparison', (req, res) => {
  res.sendFile(path.join(__dirname, 'assembly-comparison.html'));
});

app.listen(PORT, () => {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   J.codE M - 건축 탄소배출량 평가 시스템
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 서버 실행 중: http://localhost:${PORT}

📄 페이지:
   • 메인: http://localhost:${PORT}
   • 자재 선택: http://localhost:${PORT}/material-selector.html
   • 어셈블리 비교: http://localhost:${PORT}/assembly-comparison.html

🌱 국내 EPD 기반 탄소배출량 평가 시스템
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});
