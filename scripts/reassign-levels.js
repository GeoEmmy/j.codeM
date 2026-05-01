const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'materials01.xlsx');
const wb = XLSX.readFile(filePath);

// Level definitions for floor/external/internal
const gwpLevels = [
  { name: 'Level 1 (≥10000)', min: 10000, max: Infinity },
  { name: 'Level 2 (≥1000)',  min: 1000,  max: 10000 },
  { name: 'Level 3 (≥100)',   min: 100,   max: 1000 },
  { name: 'Level 4 (≥0)',     min: 0,     max: 100 },
  { name: 'Level 5 (<0)',     min: -Infinity, max: 0 },
];

// Slot counts per level (pyramid structure)
const slotCounts = {
  'Level 1 (≥10000)': 3,
  'Level 2 (≥1000)': 13,
  'Level 3 (≥100)': 15,
  'Level 4 (≥0)': 22,
  'Level 5 (<0)': 34,
};

function getLevel(gwp) {
  for (const l of gwpLevels) {
    if (gwp >= l.min && gwp < l.max) return l.name;
    // Special case: exactly 10000 → Level 1
    if (gwp === 10000 && l.name === 'Level 1 (≥10000)') return l.name;
  }
  // edge: gwp >= 10000
  if (gwp >= 10000) return 'Level 1 (≥10000)';
  return 'Level 5 (<0)';
}

const sheetsToReassign = ['floor', 'external', 'internal'];

sheetsToReassign.forEach(sheetName => {
  const ws = wb.Sheets[sheetName];
  const range = XLSX.utils.decode_range(ws['!ref']);
  const maxCol = range.e.c;

  // Read all filled rows
  const items = [];
  for (let r = 1; r <= range.e.r; r++) {
    const nameCell = ws[XLSX.utils.encode_cell({r, c: 2})];
    const name = nameCell ? String(nameCell.v).trim() : '';
    if (!name) continue;

    const row = {};
    for (let c = 0; c <= maxCol; c++) {
      const addr = XLSX.utils.encode_cell({r, c});
      row[c] = ws[addr] ? {...ws[addr]} : null;
    }
    row._name = name;
    row._gwp = row[6] ? Number(row[6].v) : null;
    items.push(row);
  }

  // Reassign levels based on GWP
  const levelGroups = {};
  gwpLevels.forEach(l => { levelGroups[l.name] = []; });

  let noGwpItems = [];
  items.forEach(item => {
    if (item._gwp === null) {
      noGwpItems.push(item);
      return;
    }
    const newLevel = getLevel(item._gwp);
    const oldLevel = item[1] ? String(item[1].v).trim() : '';
    if (oldLevel !== newLevel) {
      console.log(`  [${sheetName}] ${item._name}: ${oldLevel} → ${newLevel} (GWP: ${item._gwp})`);
    }
    levelGroups[newLevel].push(item);
  });

  // Sort each level by GWP descending
  gwpLevels.forEach(l => {
    levelGroups[l.name].sort((a, b) => b._gwp - a._gwp);
  });

  // Append no-gwp items to Level 5
  noGwpItems.forEach(item => {
    console.log(`  [${sheetName}] ${item._name}: no GWP → Level 5 (<0)`);
    levelGroups['Level 5 (<0)'].push(item);
  });

  // Check slot overflow
  gwpLevels.forEach(l => {
    const count = levelGroups[l.name].length;
    const slots = slotCounts[l.name];
    if (count > slots) {
      console.log(`  ⚠ ${sheetName} ${l.name}: ${count} items > ${slots} slots!`);
    }
  });

  // Clear all data rows
  for (let r = 1; r <= range.e.r; r++) {
    for (let c = 0; c <= maxCol; c++) {
      const addr = XLSX.utils.encode_cell({r, c});
      if (ws[addr]) delete ws[addr];
    }
  }

  // Write back with new level assignment
  let rowIdx = 1;
  let no = 1;
  gwpLevels.forEach(l => {
    const items = levelGroups[l.name];
    const slots = slotCounts[l.name];

    // Write filled items
    items.forEach(item => {
      ws[XLSX.utils.encode_cell({r: rowIdx, c: 0})] = {t: 'n', v: no};
      ws[XLSX.utils.encode_cell({r: rowIdx, c: 1})] = {t: 's', v: l.name};
      for (let c = 2; c <= maxCol; c++) {
        if (item[c]) {
          ws[XLSX.utils.encode_cell({r: rowIdx, c})] = {...item[c]};
        }
      }
      rowIdx++;
      no++;
    });

    // Write empty slots
    const emptyCount = slots - items.length;
    for (let i = 0; i < emptyCount; i++) {
      ws[XLSX.utils.encode_cell({r: rowIdx, c: 0})] = {t: 'n', v: no};
      ws[XLSX.utils.encode_cell({r: rowIdx, c: 1})] = {t: 's', v: l.name};
      rowIdx++;
      no++;
    }
  });

  // Print summary
  console.log(`\n=== ${sheetName} ===`);
  gwpLevels.forEach(l => {
    const items = levelGroups[l.name];
    console.log(`  ${l.name}: ${items.length}/${slotCounts[l.name]} slots`);
    items.forEach((item, i) => {
      console.log(`    ${i+1}. ${item._name} → ${item._gwp !== null ? item._gwp : '(no gwp)'}`);
    });
  });
});

XLSX.writeFile(wb, filePath);
console.log('\nSaved:', filePath);
