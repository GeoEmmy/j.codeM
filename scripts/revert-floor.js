const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'materials01.xlsx');
const wb = XLSX.readFile(filePath);
const ws = wb.Sheets['floor'];
const range = XLSX.utils.decode_range(ws['!ref']);
const maxCol = 13;

// The 48 items that were in the user's original floor (before restore-floor.js)
// Reconstructed from reassign-levels.js output
const originalItems = [
  // Level 1
  { name: '철재 하지틀', gwp: 21590 },
  { name: '철근', gwp: 12348 },
  // Level 2
  { name: '인조대리석', gwp: 6669 },
  { name: 'EPDM', gwp: 5570 },
  { name: '에폭시수지', gwp: 4860 },
  { name: '재활용철근', gwp: 3438.3 },
  { name: '고무바닥재', gwp: 3140 },
  { name: '우레탄방수', gwp: 2496 },
  { name: '재활용고무', gwp: 1638 },
  { name: '포세린타일', gwp: 1540 },
  { name: '이중바닥재', gwp: 1513.4 },
  { name: '비닐시트', gwp: 1486 },
  { name: 'PVC타일', gwp: 1386.6 },
  // Level 3
  { name: '바이오폴리우레탄바닥재', gwp: 923 },
  { name: '세라믹타일', gwp: 882.5 },
  { name: '재활용플라스틱데크', gwp: 757 },
  { name: '진공단열재', gwp: 683.98 },
  { name: '카펫타일', gwp: 543.1 },
  { name: '액체방수', gwp: 422.11 },
  { name: '시멘트모르타르', gwp: 422.11 },
  { name: 'XPS', gwp: 417.81 },
  { name: '콘크리트', gwp: 345 },
  { name: '대리석', gwp: 189.3 },
  { name: '저탄소 콘크리트', gwp: 176 },
  { name: '경질우레탄폼', gwp: 173.96 },
  { name: '합성목재데크', gwp: 150 },
  { name: '화강석', gwp: 101.7 },
  // Level 4
  { name: 'PF보드', gwp: 78.21 },
  { name: 'EPS', gwp: 58.8 },
  { name: '그라스울보온판', gwp: 50.4 },
  { name: '암면', gwp: 26.3 },
  { name: '양모단열재', gwp: 17.82 },
  { name: '재활용골재콘크리트', gwp: 3.611 },
  { name: '팽창퍼라이트', gwp: 2.09 },
  { name: '헴프단열재', gwp: 1.42 },
  { name: '대나무구조재', gwp: 0.2826 },
  // Level 5
  { name: '목섬유단열재', gwp: -6.11 },
  { name: '코르크단열재', gwp: -8.64 },
  { name: '셀룰로오스단열재', gwp: -72 },
  { name: '강화마루', gwp: -103.3 },
  { name: '천연목재데크', gwp: -433 },
  { name: '원목마루', gwp: -480 },
  { name: 'clt', gwp: -505.4 },
  { name: '코르크바닥', gwp: -615 },
  { name: '합판', gwp: -649 },
  { name: '목재틀', gwp: -693 },
  { name: '볏짚단열패널', gwp: -887 },
  { name: '강마루', gwp: null },
  // Note: 방부목 하지틀 and duplicate 합판 also existed
];

const keepNames = new Set(originalItems.map(i => i.name));

// Read current rows and keep only those matching original items
const keptRows = [];
const seen = new Set();
for (let r = 1; r <= range.e.r; r++) {
  const nameCell = ws[XLSX.utils.encode_cell({r, c: 2})];
  const name = nameCell ? String(nameCell.v).trim() : '';
  if (!name) continue;

  if (keepNames.has(name) && !seen.has(name)) {
    const row = {};
    for (let c = 0; c <= maxCol; c++) {
      const addr = XLSX.utils.encode_cell({r, c});
      row[c] = ws[addr] ? {...ws[addr]} : null;
    }
    row._name = name;
    row._gwp = row[6] ? Number(row[6].v) : null;
    keptRows.push(row);
    if (name !== '합판') seen.add(name); // allow one duplicate 합판
  }
}

// Level assignment
function getLevelName(gwp) {
  if (gwp === null) return 'Level 5 (<0)';
  if (gwp >= 10000) return 'Level 1 (≥10000)';
  if (gwp >= 1000) return 'Level 2 (≥1000)';
  if (gwp >= 100) return 'Level 3 (≥100)';
  if (gwp >= 0) return 'Level 4 (≥0)';
  return 'Level 5 (<0)';
}

const levelSlots = {
  'Level 1 (≥10000)': 3,
  'Level 2 (≥1000)': 13,
  'Level 3 (≥100)': 15,
  'Level 4 (≥0)': 22,
  'Level 5 (<0)': 34,
};
const levelOrder = Object.keys(levelSlots);

const groups = {};
levelOrder.forEach(l => { groups[l] = []; });
keptRows.forEach(row => {
  groups[getLevelName(row._gwp)].push(row);
});
levelOrder.forEach(l => {
  groups[l].sort((a, b) => {
    if (a._gwp === null && b._gwp === null) return 0;
    if (a._gwp === null) return 1;
    if (b._gwp === null) return -1;
    return b._gwp - a._gwp;
  });
});

// Clear all
for (let r = 1; r <= range.e.r; r++) {
  for (let c = 0; c <= maxCol; c++) {
    const addr = XLSX.utils.encode_cell({r, c});
    if (ws[addr]) delete ws[addr];
  }
}

// Write back
let rowIdx = 1;
let no = 1;
levelOrder.forEach(lvl => {
  const items = groups[lvl];
  const slots = levelSlots[lvl];
  items.forEach(item => {
    ws[XLSX.utils.encode_cell({r: rowIdx, c: 0})] = {t:'n', v: no};
    ws[XLSX.utils.encode_cell({r: rowIdx, c: 1})] = {t:'s', v: lvl};
    for (let c = 2; c <= maxCol; c++) {
      if (item[c]) ws[XLSX.utils.encode_cell({r: rowIdx, c})] = {...item[c]};
    }
    rowIdx++; no++;
  });
  const emptyCount = Math.max(0, slots - items.length);
  for (let i = 0; i < emptyCount; i++) {
    ws[XLSX.utils.encode_cell({r: rowIdx, c: 0})] = {t:'n', v: no};
    ws[XLSX.utils.encode_cell({r: rowIdx, c: 1})] = {t:'s', v: lvl};
    rowIdx++; no++;
  }
  console.log(`${lvl}: ${items.length} items`);
  items.forEach(it => console.log(`  ${it._name} (${it._gwp})`));
});

ws['!ref'] = XLSX.utils.encode_range({s:{r:0,c:0}, e:{r:rowIdx-1, c:maxCol}});
XLSX.writeFile(wb, filePath);
console.log('\nTotal:', keptRows.length, 'items');
console.log('Saved:', filePath);
