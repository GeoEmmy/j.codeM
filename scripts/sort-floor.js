const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'materials01.xlsx');
const wb = XLSX.readFile(filePath);
const ws = wb.Sheets['floor'];
const range = XLSX.utils.decode_range(ws['!ref']);
const maxCol = range.e.c; // N = 13

// Read all data rows (skip header row 0)
const rows = [];
for (let r = 1; r <= range.e.r; r++) {
  const row = {};
  for (let c = 0; c <= maxCol; c++) {
    const addr = XLSX.utils.encode_cell({r, c});
    row[c] = ws[addr] ? ws[addr] : null;
  }
  row._level = row[1] ? String(row[1].v).trim() : '';
  row._name = row[2] ? String(row[2].v).trim() : '';
  row._gwp = row[6] ? Number(row[6].v) : null;
  row._origRow = r;
  rows.push(row);
}

// Group rows by level
const levelOrder = [
  'Level 1 (≥10000)',
  'Level 2 (≥1000)',
  'Level 3 (≥100)',
  'Level 4 (≥0)',
  'Level 5 (<0)'
];

const groups = {};
levelOrder.forEach(l => { groups[l] = { filled: [], empty: [] }; });

rows.forEach(row => {
  const lvl = row._level;
  if (!groups[lvl]) return; // skip unknown
  if (row._name) {
    groups[lvl].filled.push(row);
  } else {
    groups[lvl].empty.push(row);
  }
});

// Sort each level: by GWP descending, no-gwp items at end
levelOrder.forEach(lvl => {
  groups[lvl].filled.sort((a, b) => {
    if (a._gwp === null && b._gwp === null) return 0;
    if (a._gwp === null) return 1;
    if (b._gwp === null) return -1;
    return b._gwp - a._gwp; // descending
  });
});

// Rebuild sorted rows
const sortedRows = [];
levelOrder.forEach(lvl => {
  const g = groups[lvl];
  // filled first, then empty slots
  g.filled.forEach(r => sortedRows.push(r));
  g.empty.forEach(r => sortedRows.push(r));
});

// Write back to sheet, re-numbering 'no' column
sortedRows.forEach((row, idx) => {
  const r = idx + 1; // row index (0 = header)
  // Write no (column A)
  ws[XLSX.utils.encode_cell({r, c:0})] = {t:'n', v: idx + 1};
  // Write level (column B) - keep original level
  if (row[1]) {
    ws[XLSX.utils.encode_cell({r, c:1})] = {...row[1]};
  } else {
    const addr = XLSX.utils.encode_cell({r, c:1});
    if (ws[addr]) delete ws[addr];
  }
  // Write columns C through N
  for (let c = 2; c <= maxCol; c++) {
    const addr = XLSX.utils.encode_cell({r, c});
    if (row[c]) {
      ws[addr] = {...row[c]};
    } else {
      if (ws[addr]) delete ws[addr];
    }
  }
});

XLSX.writeFile(wb, filePath);

// Print result
console.log('=== Sorted floor tab ===');
let currentLevel = '';
sortedRows.forEach((row, idx) => {
  if (row._level !== currentLevel) {
    currentLevel = row._level;
    console.log('\n--- ' + currentLevel + ' ---');
  }
  if (row._name) {
    const gwpStr = row._gwp !== null ? row._gwp : '(no gwp)';
    console.log(`  ${idx+1}. ${row._name} (${row._name ? row[3]?.v || '' : ''}) → GWP: ${gwpStr}`);
  }
});
