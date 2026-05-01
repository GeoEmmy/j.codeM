const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'materials01.xlsx');
const wb = XLSX.readFile(filePath);

// For external and internal: restore proper sort within EXISTING levels (no reassignment)
['external', 'internal'].forEach(sheetName => {
  const ws = wb.Sheets[sheetName];
  const range = XLSX.utils.decode_range(ws['!ref']);
  const maxCol = range.e.c;

  // Read all rows
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

  // Collect levels in order
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
    if (!groups[row._level]) return;
    if (row._name) groups[row._level].filled.push(row);
    else groups[row._level].empty.push(row);
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

  // Clear and rewrite
  for (let r = 1; r <= range.e.r; r++) {
    for (let c = 0; c <= maxCol; c++) {
      const addr = XLSX.utils.encode_cell({r, c});
      if (ws[addr]) delete ws[addr];
    }
  }

  let rowIdx = 1;
  let no = 1;
  levelOrder.forEach(lvl => {
    const filled = groups[lvl].filled;
    const empty = groups[lvl].empty;
    [...filled, ...empty].forEach(row => {
      ws[XLSX.utils.encode_cell({r: rowIdx, c: 0})] = {t:'n', v: no};
      ws[XLSX.utils.encode_cell({r: rowIdx, c: 1})] = {t:'s', v: lvl};
      for (let c = 2; c <= maxCol; c++) {
        if (row[c]) ws[XLSX.utils.encode_cell({r: rowIdx, c})] = {...row[c]};
      }
      rowIdx++;
      no++;
    });
  });

  // Update range
  ws['!ref'] = XLSX.utils.encode_range({s:{r:0,c:0}, e:{r:rowIdx-1, c:maxCol}});

  // Count
  let total = 0;
  levelOrder.forEach(l => { total += groups[l].filled.length; });
  console.log(`${sheetName}: ${total} items restored & sorted`);
});

XLSX.writeFile(wb, filePath);
console.log('Saved:', filePath);
