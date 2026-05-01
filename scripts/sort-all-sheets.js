const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'materials01.xlsx');
const wb = XLSX.readFile(filePath);

const sheets = ['floor', 'external', 'internal', 'ceiling', 'window'];

sheets.forEach(sheetName => {
  const ws = wb.Sheets[sheetName];
  const range = XLSX.utils.decode_range(ws['!ref']);
  const maxCol = range.e.c;

  // Read all data rows
  const rows = [];
  for (let r = 1; r <= range.e.r; r++) {
    const row = {};
    for (let c = 0; c <= maxCol; c++) {
      const addr = XLSX.utils.encode_cell({r, c});
      row[c] = ws[addr] ? {...ws[addr]} : null;
    }
    row._level = row[1] ? String(row[1].v).trim() : '';
    row._name = row[2] ? String(row[2].v).trim() : '';
    row._gwp = row[6] ? Number(row[6].v) : null;
    rows.push(row);
  }

  // Collect unique levels in order
  const levelOrder = [];
  rows.forEach(r => {
    if (r._level && !levelOrder.includes(r._level)) {
      levelOrder.push(r._level);
    }
  });

  // Group by level
  const groups = {};
  levelOrder.forEach(l => { groups[l] = { filled: [], empty: [] }; });

  rows.forEach(row => {
    const lvl = row._level;
    if (!groups[lvl]) return;
    if (row._name) {
      groups[lvl].filled.push(row);
    } else {
      groups[lvl].empty.push(row);
    }
  });

  // Sort each level by GWP descending
  levelOrder.forEach(lvl => {
    groups[lvl].filled.sort((a, b) => {
      if (a._gwp === null && b._gwp === null) return 0;
      if (a._gwp === null) return 1;
      if (b._gwp === null) return -1;
      return b._gwp - a._gwp;
    });
  });

  // Rebuild
  const sortedRows = [];
  levelOrder.forEach(lvl => {
    groups[lvl].filled.forEach(r => sortedRows.push(r));
    groups[lvl].empty.forEach(r => sortedRows.push(r));
  });

  // Write back
  sortedRows.forEach((row, idx) => {
    const r = idx + 1;
    ws[XLSX.utils.encode_cell({r, c:0})] = {t:'n', v: idx + 1};
    for (let c = 1; c <= maxCol; c++) {
      const addr = XLSX.utils.encode_cell({r, c});
      if (row[c]) {
        ws[addr] = {...row[c]};
      } else {
        if (ws[addr]) delete ws[addr];
      }
    }
  });

  // Print summary
  let itemCount = 0;
  levelOrder.forEach(lvl => {
    const filled = groups[lvl].filled;
    if (filled.length > 0) {
      itemCount += filled.length;
    }
  });
  console.log(`${sheetName}: ${itemCount} items sorted`);

  // Print detail
  let currentLevel = '';
  sortedRows.forEach((row, idx) => {
    if (row._level !== currentLevel) {
      currentLevel = row._level;
      console.log(`  [${currentLevel}]`);
    }
    if (row._name) {
      const gwp = row._gwp !== null ? row._gwp : '(no gwp)';
      console.log(`    ${idx+1}. ${row._name} → ${gwp}`);
    }
  });
  console.log('');
});

XLSX.writeFile(wb, filePath);
console.log('Saved:', filePath);
