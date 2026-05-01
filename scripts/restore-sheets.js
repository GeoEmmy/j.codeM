const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'materials01.xlsx');
const wb = XLSX.readFile(filePath);

// Load backup data from git HEAD epd-korea.js
const backupSrc = fs.readFileSync(path.join(__dirname, '..', 'data', 'epd-backup.js'), 'utf8');
const match = backupSrc.match(/const KOREAN_EPD = ([\s\S]*);/);
const backupData = JSON.parse(match[1]);

// Column mapping: JS field → Excel column index
const colMap = {
  // col 0: no
  // col 1: level (from original sheet structure)
  name: 2,
  nameEn: 3,
  category: 4,
  categoryName: 5,
  gwp: 6,
  unit: 7,
  density: 8,
  thickness: 9,
  color: 10,
  source: 11,
  tip: 12,
  description: 13,
};

// Level thresholds
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

['external', 'internal'].forEach(sheetName => {
  const ws = wb.Sheets[sheetName];
  const materials = backupData[sheetName].materials;
  const maxCol = 13; // N column

  // Clear existing data
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let r = 1; r <= range.e.r; r++) {
    for (let c = 0; c <= maxCol; c++) {
      const addr = XLSX.utils.encode_cell({r, c});
      if (ws[addr]) delete ws[addr];
    }
  }

  // Group by ORIGINAL level (keep original level assignment, don't reassign)
  // But we need to figure out original levels from the backup data
  // The backup JS doesn't have level info, so we use the level from the current sheet structure
  // Since that's corrupted, we'll just sort by GWP and keep in original level structure

  // Actually, the user said to IGNORE external/internal for level reassignment
  // So just put them back with their original levels preserved
  // We can infer original level from the material order in the backup (which was ordered by level)

  // Simple approach: write all materials sorted by GWP desc within each level
  // Keep original level assignment (don't change levels)
  // Group materials by their GWP-based level
  const groups = {};
  levelOrder.forEach(l => { groups[l] = []; });

  materials.forEach(mat => {
    const level = getLevelName(mat.gwp);
    groups[level].push(mat);
  });

  // Sort within each group by GWP desc
  levelOrder.forEach(l => {
    groups[l].sort((a, b) => b.gwp - a.gwp);
  });

  // Write to sheet
  let rowIdx = 1;
  let no = 1;
  levelOrder.forEach(lvl => {
    const items = groups[lvl];
    const slots = levelSlots[lvl];
    const writeCount = Math.min(items.length, slots);

    // Write filled items (up to slot count)
    for (let i = 0; i < writeCount; i++) {
      const mat = items[i];
      ws[XLSX.utils.encode_cell({r: rowIdx, c: 0})] = {t:'n', v: no};
      ws[XLSX.utils.encode_cell({r: rowIdx, c: 1})] = {t:'s', v: lvl};

      // name
      if (mat.name) ws[XLSX.utils.encode_cell({r: rowIdx, c: 2})] = {t:'s', v: mat.name};
      // name_en
      if (mat.nameEn) ws[XLSX.utils.encode_cell({r: rowIdx, c: 3})] = {t:'s', v: mat.nameEn};
      // category
      if (mat.category) ws[XLSX.utils.encode_cell({r: rowIdx, c: 4})] = {t:'s', v: mat.category};
      // categoryName
      if (mat.categoryName) ws[XLSX.utils.encode_cell({r: rowIdx, c: 5})] = {t:'s', v: mat.categoryName};
      // gwp
      ws[XLSX.utils.encode_cell({r: rowIdx, c: 6})] = {t:'n', v: mat.gwp};
      // unit
      if (mat.unit) ws[XLSX.utils.encode_cell({r: rowIdx, c: 7})] = {t:'s', v: mat.unit};
      // density
      if (mat.density) ws[XLSX.utils.encode_cell({r: rowIdx, c: 8})] = {t:'n', v: mat.density};
      // thickness
      if (mat.thickness !== undefined) ws[XLSX.utils.encode_cell({r: rowIdx, c: 9})] = {t:'n', v: mat.thickness};
      // color
      if (mat.color && mat.color !== '#636e72') ws[XLSX.utils.encode_cell({r: rowIdx, c: 10})] = {t:'s', v: mat.color};
      // source
      if (mat.source) ws[XLSX.utils.encode_cell({r: rowIdx, c: 11})] = {t:'s', v: mat.source};
      // tip
      if (mat.tip) ws[XLSX.utils.encode_cell({r: rowIdx, c: 12})] = {t:'s', v: mat.tip};
      // description
      if (mat.description) ws[XLSX.utils.encode_cell({r: rowIdx, c: 13})] = {t:'s', v: mat.description};

      rowIdx++;
      no++;
    }

    // Overflow warning
    if (items.length > slots) {
      console.log(`  ⚠ ${sheetName} ${lvl}: ${items.length} items, only ${slots} slots (${items.length - slots} overflow kept)`);
      // Write overflow items too (extend slots)
      for (let i = writeCount; i < items.length; i++) {
        const mat = items[i];
        ws[XLSX.utils.encode_cell({r: rowIdx, c: 0})] = {t:'n', v: no};
        ws[XLSX.utils.encode_cell({r: rowIdx, c: 1})] = {t:'s', v: lvl};
        if (mat.name) ws[XLSX.utils.encode_cell({r: rowIdx, c: 2})] = {t:'s', v: mat.name};
        if (mat.nameEn) ws[XLSX.utils.encode_cell({r: rowIdx, c: 3})] = {t:'s', v: mat.nameEn};
        if (mat.category) ws[XLSX.utils.encode_cell({r: rowIdx, c: 4})] = {t:'s', v: mat.category};
        if (mat.categoryName) ws[XLSX.utils.encode_cell({r: rowIdx, c: 5})] = {t:'s', v: mat.categoryName};
        ws[XLSX.utils.encode_cell({r: rowIdx, c: 6})] = {t:'n', v: mat.gwp};
        if (mat.unit) ws[XLSX.utils.encode_cell({r: rowIdx, c: 7})] = {t:'s', v: mat.unit};
        if (mat.density) ws[XLSX.utils.encode_cell({r: rowIdx, c: 8})] = {t:'n', v: mat.density};
        if (mat.thickness !== undefined) ws[XLSX.utils.encode_cell({r: rowIdx, c: 9})] = {t:'n', v: mat.thickness};
        if (mat.color && mat.color !== '#636e72') ws[XLSX.utils.encode_cell({r: rowIdx, c: 10})] = {t:'s', v: mat.color};
        if (mat.source) ws[XLSX.utils.encode_cell({r: rowIdx, c: 11})] = {t:'s', v: mat.source};
        if (mat.tip) ws[XLSX.utils.encode_cell({r: rowIdx, c: 12})] = {t:'s', v: mat.tip};
        if (mat.description) ws[XLSX.utils.encode_cell({r: rowIdx, c: 13})] = {t:'s', v: mat.description};
        rowIdx++;
        no++;
      }
    }

    // Write empty slots
    const totalWritten = items.length;
    const emptySlots = Math.max(0, slots - totalWritten);
    for (let i = 0; i < emptySlots; i++) {
      ws[XLSX.utils.encode_cell({r: rowIdx, c: 0})] = {t:'n', v: no};
      ws[XLSX.utils.encode_cell({r: rowIdx, c: 1})] = {t:'s', v: lvl};
      rowIdx++;
      no++;
    }
  });

  // Update range
  ws['!ref'] = XLSX.utils.encode_range({s:{r:0,c:0}, e:{r:rowIdx-1, c:maxCol}});

  console.log(`${sheetName}: ${materials.length} items restored`);
});

XLSX.writeFile(wb, filePath);
console.log('Saved:', filePath);
