/**
 * CSV → materials01.xlsx 변환
 * CSV 데이터를 피라미드 슬롯 구조의 엑셀로 변환
 *
 * 사용법: node scripts/csv-to-materials01.js
 */

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '../data/materials_gwp_simple.csv');
const OUTPUT_PATH = path.join(__dirname, '../data/materials01.xlsx');

// 피라미드 구조
const ROW_SLOTS = [1, 2, 3, 4, 6, 7, 8, 10, 12, 14, 16];
const TOTAL_SLOTS = ROW_SLOTS.reduce((a, b) => a + b, 0); // 83

// m³ 단위 Level 그룹
const GROUP_CONFIGS = [
  { name: 'Level 1 (≥10000)', level: 1 },
  { name: 'Level 2 (≥1000)', level: 2 },
  { name: 'Level 3 (≥100)', level: 3 },
  { name: 'Level 4 (≥0)', level: 4 },
  { name: 'Level 5 (<0)', level: 5 },
];
const GROUP_ROW_INDICES = [[0,1],[2,3,4],[5,6],[7,8],[9,10]];
const GROUP_SLOTS = GROUP_ROW_INDICES.map(ri => ri.reduce((s, i) => s + ROW_SLOTS[i], 0));

// 구조체 → 시트명
const STRUCTURE_MAP = {
  '바닥': 'floor', '외벽': 'external', '내벽': 'internal',
  '천장': 'ceiling', '창호': 'window'
};

// 카테고리 → category ID
const CATEGORY_MAP = {
  '구조재': 'structural', '마감재': 'finishing', '단열재': 'insulation',
  '유리': 'glass', '외장재': 'exterior', '프레임': 'frame', '방수재': 'waterproof'
};

// 카테고리별 색상
const COLOR_MAP = {
  'structural': '#636e72', 'insulation': '#fdcb6e', 'finishing': '#74b9ff',
  'exterior': '#e17055', 'glass': '#81ecec', 'frame': '#a29bfe', 'waterproof': '#6c5ce7'
};

// CSV 파싱
function parseCSV(text) {
  const lines = text.split('\n');
  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseLine(line);
    const row = {};
    headers.forEach((h, idx) => { row[h.trim()] = (values[idx] || '').trim(); });
    rows.push(row);
  }
  return rows;
}

function parseLine(line) {
  const result = [];
  let current = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') inQ = !inQ;
    else if (line[i] === ',' && !inQ) { result.push(current); current = ''; }
    else current += line[i];
  }
  result.push(current);
  return result;
}

async function main() {
  const csvText = fs.readFileSync(CSV_PATH, 'utf8');
  const rows = parseCSV(csvText);

  // 시트별 분류
  const sheets = { floor: [], external: [], internal: [], ceiling: [], window: [] };

  rows.forEach(row => {
    const sheetName = STRUCTURE_MAP[row['구조체']];
    if (!sheetName) return;

    const catName = row['분류'] || '마감재';
    const category = CATEGORY_MAP[catName] || 'finishing';

    sheets[sheetName].push({
      name: row['자재명'] || '',
      category,
      categoryName: catName,
      gwp: parseFloat(row['GWP']) || 0,
      unit: row['단위'] || 'kgCO2e/m³',
      density: row['밀도 (kg/m³)'] || '',
      color: COLOR_MAP[category] || '#b2bec3',
      source: row['출처'] || '',
      description: row['상세설명'] || '',
      image: row['이미지'] || ''
    });
  });

  // 엑셀 생성
  const wb = new ExcelJS.Workbook();

  // 사용방법 시트
  const guide = wb.addWorksheet('사용방법');
  guide.columns = [{ width: 60 }];
  [
    ['[ 피라미드 자재 DB ]'],
    [''],
    ['각 시트: floor, external, internal, ceiling, window'],
    ['no: 피라미드 슬롯 번호 (1~83)'],
    ['level: GWP 그룹 (Level 1~5) 또는 행번호 (R1~R11)'],
    ['빈 행 = 채워야 할 슬롯'],
    [''],
    ['[ 피라미드 구조 - 11행, 83슬롯 ]'],
    ['Level 1 (≥10000): R1(1) + R2(2) = 3슬롯'],
    ['Level 2 (≥1000): R3(3) + R4(4) + R5(6) = 13슬롯'],
    ['Level 3 (≥100): R6(7) + R7(8) = 15슬롯'],
    ['Level 4 (≥0): R8(10) + R9(12) = 22슬롯'],
    ['Level 5 (<0): R10(14) + R11(16) = 30슬롯'],
    [''],
    ['천장/창호는 m² 단위 → 순서대로 배치 (Level 그룹 없음)'],
  ].forEach(r => guide.addRow(r));

  const headerNames = ['no', 'level', 'name', 'image', 'category', 'categoryName', 'gwp', 'unit', 'density', 'color', 'source', 'description'];
  const headerWidths = [5, 20, 20, 15, 15, 12, 12, 15, 10, 10, 35, 40];

  const types = ['floor', 'external', 'internal', 'ceiling', 'window'];
  const isM2Type = { ceiling: true, window: true };

  types.forEach(type => {
    const sheet = wb.addWorksheet(type);

    // 헤더
    const hRow = sheet.getRow(1);
    headerNames.forEach((h, i) => { hRow.getCell(i + 1).value = h; });
    hRow.commit();
    headerWidths.forEach((w, i) => { sheet.getColumn(i + 1).width = w; });

    const materials = sheets[type];
    // GWP 내림차순 정렬
    materials.sort((a, b) => b.gwp - a.gwp);

    let rowNum = 2;

    if (isM2Type[type]) {
      // 천장/창호: 순서대로 배치
      let globalNo = 1;
      let matIdx = 0;

      ROW_SLOTS.forEach((slotCount, ri) => {
        const pyramidRow = ri + 1;
        const levelLabel = 'R' + pyramidRow + ' (' + slotCount + '슬롯)';

        for (let i = 0; i < slotCount; i++) {
          const row = sheet.getRow(rowNum);
          row.getCell(1).value = globalNo;
          row.getCell(2).value = levelLabel;

          const mat = materials[matIdx];
          if (mat) {
            row.getCell(3).value = mat.name;
            row.getCell(4).value = mat.image;
            row.getCell(5).value = mat.category;
            row.getCell(6).value = mat.categoryName;
            row.getCell(7).value = mat.gwp;
            row.getCell(8).value = mat.unit;
            row.getCell(9).value = mat.density ? Number(mat.density) : '';
            row.getCell(10).value = mat.color;
            row.getCell(11).value = mat.source;
            row.getCell(12).value = mat.description;
            matIdx++;
          }

          row.commit();
          globalNo++;
          rowNum++;
        }
      });
    } else {
      // 바닥/외벽/내벽: Level 그룹 방식
      const groups = [[], [], [], [], []];
      materials.forEach(m => {
        if (m.gwp >= 10000) groups[0].push(m);
        else if (m.gwp >= 1000) groups[1].push(m);
        else if (m.gwp >= 100) groups[2].push(m);
        else if (m.gwp >= 0) groups[3].push(m);
        else groups[4].push(m);
      });

      let globalNo = 1;

      groups.forEach((groupMats, gi) => {
        const levelName = GROUP_CONFIGS[gi].name;
        const slots = GROUP_SLOTS[gi];

        for (let i = 0; i < slots; i++) {
          const row = sheet.getRow(rowNum);
          row.getCell(1).value = globalNo;
          row.getCell(2).value = levelName;

          const mat = groupMats[i];
          if (mat) {
            row.getCell(3).value = mat.name;
            row.getCell(4).value = mat.image;
            row.getCell(5).value = mat.category;
            row.getCell(6).value = mat.categoryName;
            row.getCell(7).value = mat.gwp;
            row.getCell(8).value = mat.unit;
            row.getCell(9).value = mat.density ? Number(mat.density) : '';
            row.getCell(10).value = mat.color;
            row.getCell(11).value = mat.source;
            row.getCell(12).value = mat.description;
          }

          row.commit();
          globalNo++;
          rowNum++;
        }
      });
    }

    const filled = materials.length;
    console.log(type + ': ' + filled + '/' + TOTAL_SLOTS + ' (' + (TOTAL_SLOTS - filled) + '개 빈슬롯)');
  });

  await wb.xlsx.writeFile(OUTPUT_PATH);
  console.log('\n✅ ' + OUTPUT_PATH + ' 저장 완료');
}

main().catch(e => { console.error(e); process.exit(1); });
