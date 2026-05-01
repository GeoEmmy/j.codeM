const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'materials01.xlsx');
const wb = XLSX.readFile(filePath);

// Load backup data
const backupSrc = fs.readFileSync(path.join(__dirname, '..', 'data', 'epd-backup.js'), 'utf8');
const match = backupSrc.match(/const KOREAN_EPD = ([\s\S]*);/);
const backupData = JSON.parse(match[1]);

// Current floor data
const ws = wb.Sheets['floor'];
const range = XLSX.utils.decode_range(ws['!ref']);
const maxCol = 13;

// Read current items
const currentItems = [];
for (let r = 1; r <= range.e.r; r++) {
  const nameCell = ws[XLSX.utils.encode_cell({r, c: 2})];
  if (!nameCell || !String(nameCell.v).trim()) continue;
  const row = {};
  for (let c = 0; c <= maxCol; c++) {
    const addr = XLSX.utils.encode_cell({r, c});
    row[c] = ws[addr] ? {...ws[addr]} : null;
  }
  row._name = String(nameCell.v).trim();
  row._gwp = row[6] ? Number(row[6].v) : 0;
  currentItems.push(row);
}

// Backup floor materials
const backupMats = backupData.floor.materials;

// Merge: backup as base, add any current items not in backup
const backupNames = new Set(backupMats.map(m => m.name));
const currentNames = new Set(currentItems.map(r => r._name));

// Convert backup material to row format
function matToRow(mat) {
  const row = {};
  row[2] = {t:'s', v: mat.name};
  row[3] = {t:'s', v: mat.nameEn || ''};
  row[4] = {t:'s', v: mat.category || ''};
  row[5] = {t:'s', v: mat.categoryName || ''};
  row[6] = {t:'n', v: mat.gwp || 0};
  row[7] = {t:'s', v: mat.unit || 'kgCO2e/m³'};
  row[8] = {t:'n', v: mat.density || 1000};
  if (mat.thickness !== undefined) row[9] = {t:'n', v: mat.thickness};
  if (mat.color && mat.color !== '#636e72') row[10] = {t:'s', v: mat.color};
  if (mat.source) row[11] = {t:'s', v: mat.source};
  if (mat.tip) row[12] = {t:'s', v: mat.tip};
  if (mat.description) row[13] = {t:'s', v: mat.description};
  row._name = mat.name;
  row._gwp = mat.gwp || 0;
  return row;
}

// Start with backup items
const allItems = backupMats.map(matToRow);

// Add current items NOT in backup (truly new items)
currentItems.forEach(item => {
  if (!backupNames.has(item._name)) {
    allItems.push(item);
    console.log('NEW item kept:', item._name, '→', item._gwp);
  }
});

// Sort all by GWP descending
allItems.sort((a, b) => b._gwp - a._gwp);

console.log('Total items:', allItems.length);

// Level assignment
function getLevelName(gwp) {
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

// Group by GWP-based level
const groups = {};
levelOrder.forEach(l => { groups[l] = []; });
allItems.forEach(item => {
  const level = getLevelName(item._gwp);
  groups[level].push(item);
});

// Sort each group
levelOrder.forEach(l => {
  groups[l].sort((a, b) => b._gwp - a._gwp);
});

// Clear sheet
for (let r = 1; r <= range.e.r + 20; r++) {
  for (let c = 0; c <= maxCol; c++) {
    const addr = XLSX.utils.encode_cell({r, c});
    if (ws[addr]) delete ws[addr];
  }
}

// Write
let rowIdx = 1;
let no = 1;
levelOrder.forEach(lvl => {
  const items = groups[lvl];
  const slots = levelSlots[lvl];

  // Write all items (extend slots if needed)
  items.forEach(item => {
    ws[XLSX.utils.encode_cell({r: rowIdx, c: 0})] = {t:'n', v: no};
    ws[XLSX.utils.encode_cell({r: rowIdx, c: 1})] = {t:'s', v: lvl};
    for (let c = 2; c <= maxCol; c++) {
      if (item[c]) ws[XLSX.utils.encode_cell({r: rowIdx, c})] = {...item[c]};
    }
    rowIdx++;
    no++;
  });

  // Fill empty slots
  const emptyCount = Math.max(0, slots - items.length);
  for (let i = 0; i < emptyCount; i++) {
    ws[XLSX.utils.encode_cell({r: rowIdx, c: 0})] = {t:'n', v: no};
    ws[XLSX.utils.encode_cell({r: rowIdx, c: 1})] = {t:'s', v: lvl};
    rowIdx++;
    no++;
  }

  console.log(`  ${lvl}: ${items.length} items`);
  items.forEach((it, i) => console.log(`    ${i+1}. ${it._name} → ${it._gwp}`));
});

ws['!ref'] = XLSX.utils.encode_range({s:{r:0,c:0}, e:{r:rowIdx-1, c:maxCol}});

XLSX.writeFile(wb, filePath);
console.log('Saved:', filePath);
