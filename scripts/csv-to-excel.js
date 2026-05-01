/**
 * CSV → materials.xlsx 변환
 * CSV 데이터를 convert-excel.js가 읽을 수 있는 엑셀 형식으로 변환
 *
 * 사용법: node scripts/csv-to-excel.js
 */

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '../data/materials_gwp_simple.csv');
const OUTPUT_PATH = path.join(__dirname, '../data/materials.xlsx');

// 구조체 → 시트명 매핑
const STRUCTURE_MAP = {
  '바닥': 'floor',
  '외벽': 'external',
  '내벽': 'internal',
  '천장': 'ceiling',
  '창호': 'window'
};

// 분류 → category 매핑
const CATEGORY_MAP = {
  '구조재': 'structural',
  '마감재': 'finishing',
  '단열재': 'insulation',
  '유리': 'glass',
  '외장재': 'exterior',
  '프레임': 'frame'
};

// 카테고리별 색상
const COLOR_MAP = {
  'structural': '#636e72',
  'insulation': '#fdcb6e',
  'finishing': '#74b9ff',
  'exterior': '#e17055',
  'glass': '#81ecec',
  'frame': '#a29bfe'
};

// ID 생성
function makeId(sheetName, name, index) {
  const clean = name
    .replace(/[^a-zA-Z0-9가-힣]/g, '_')
    .substring(0, 20);
  return `${sheetName}_${index}_${clean}`;
}

// CSV 파싱 (간단한 CSV 파서, 쉼표 포함 필드 처리)
function parseCSV(text) {
  const lines = text.split('\n');
  const headers = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = (values[idx] || '').trim();
    });
    rows.push(row);
  }

  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

async function main() {
  const csvText = fs.readFileSync(CSV_PATH, 'utf8');
  const rows = parseCSV(csvText);

  // 시트별로 분류
  const sheets = {
    floor: [],
    external: [],
    internal: [],
    ceiling: [],
    window: []
  };

  const counters = { floor: 0, external: 0, internal: 0, ceiling: 0, window: 0 };

  rows.forEach(row => {
    const structure = row['구조체'];
    const sheetName = STRUCTURE_MAP[structure];
    if (!sheetName) return;

    const categoryName = row['분류'] || '마감재';
    const category = CATEGORY_MAP[categoryName] || 'finishing';
    const name = row['자재명'] || '';
    const gwp = parseFloat(row['GWP (kgCO2e/m³)']) || 0;
    const density = parseInt(row['밀도 (kg/m³)']) || 1000;
    const source = row['출처'] || '';
    const description = row['상세설명'] || '';
    const image = row['이미지'] || '';

    const id = makeId(sheetName, name, counters[sheetName]++);

    sheets[sheetName].push({
      id,
      name,
      nameEn: '',
      category,
      categoryName,
      gwp,
      unit: 'kgCO2e/m³',
      density,
      color: COLOR_MAP[category] || '#b2bec3',
      source,
      description,
      image
    });
  });

  // 엑셀 생성
  const workbook = new ExcelJS.Workbook();

  // 사용방법 시트
  const guideSheet = workbook.addWorksheet('사용방법');
  guideSheet.columns = [{ width: 60 }];
  const guideData = [
    ['[ 변환 방법 ]'],
    [''],
    ['1. 이 엑셀 파일에서 자재 데이터를 수정합니다.'],
    ['2. 자재 행의 우측에 이미지를 삽입합니다 (선택).'],
    ['3. 터미널에서: npm run db:convert'],
    ['4. data/epd-korea.js 자동 생성 + 이미지 추출'],
    ['5. 웹 새로고침하면 반영됩니다.'],
    [''],
    ['[ 데이터 출처 ]'],
    ['- 환경성적표지 유효인증 제품목록'],
    ['- ICE Database v3 (Circular Ecology)'],
    ['- materials_gwp_simple.csv에서 변환']
  ];
  guideData.forEach(row => guideSheet.addRow(row));

  // 각 시트 생성
  const types = ['floor', 'external', 'internal', 'ceiling', 'window'];
  types.forEach(type => {
    const sheet = workbook.addWorksheet(type);
    sheet.columns = [
      { header: 'id', key: 'id', width: 25 },
      { header: 'name', key: 'name', width: 20 },
      { header: 'image', key: 'image', width: 15 },
      { header: 'category', key: 'category', width: 15 },
      { header: 'categoryName', key: 'categoryName', width: 12 },
      { header: 'gwp', key: 'gwp', width: 12 },
      { header: 'unit', key: 'unit', width: 15 },
      { header: 'density', key: 'density', width: 10 },
      { header: 'color', key: 'color', width: 10 },
      { header: 'source', key: 'source', width: 35 },
      { header: 'description', key: 'description', width: 40 },
    ];

    sheets[type].forEach(row => sheet.addRow(row));
  });

  await workbook.xlsx.writeFile(OUTPUT_PATH);

  console.log(`\n✅ 엑셀 생성 완료: ${OUTPUT_PATH}`);
  console.log('\n자재 수:');
  types.forEach(t => {
    if (sheets[t].length > 0) {
      console.log(`  - ${t}: ${sheets[t].length}개`);
    }
  });
  const total = Object.values(sheets).flat().length;
  console.log(`  총: ${total}개`);
}

main().catch(err => {
  console.error('오류:', err);
  process.exit(1);
});
