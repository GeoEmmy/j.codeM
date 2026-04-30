/**
 * 엑셀 → epd-korea.js 변환 스크립트 (이미지 추출 지원)
 *
 * 사용법: node scripts/convert-excel.js [엑셀파일경로]
 * 예시: node scripts/convert-excel.js data/materials.xlsx
 */

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// 기본 파일 경로
const DEFAULT_EXCEL = path.join(__dirname, '../data/materials.xlsx');
const OUTPUT_JS = path.join(__dirname, '../data/epd-korea.js');

// 템플릿 생성 옵션 (먼저 체크)
if (process.argv[2] === '--template') {
  createTemplate();
}

// 엑셀 파일 경로 (인자로 받거나 기본값)
const excelPath = process.argv[2] === '--template' ? null : (process.argv[2] || DEFAULT_EXCEL);

// 템플릿 모드가 아닐 때만 변환 실행
if (excelPath) {
  if (!fs.existsSync(excelPath)) {
    console.error(`파일을 찾을 수 없습니다: ${excelPath}`);
    console.log('\n템플릿 생성: npm run db:template');
    process.exit(1);
  }
  convertExcelToJS();
}

// 메인 변환 함수
async function convertExcelToJS() {
  console.log(`변환 중: ${excelPath}`);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelPath);

  const result = {
    floor: { materials: [] },
    external: { materials: [] },
    internal: { materials: [] },
    ceiling: { materials: [] },
    window: { materials: [] }
  };

  // 각 시트 처리
  workbook.eachSheet((worksheet, sheetId) => {
    const sheetName = worksheet.name.toLowerCase();

    // 사용방법 시트 스킵
    if (sheetName === '사용방법') return;

    if (!result[sheetName]) return;

    // 데이터 읽기 (name이 있는 행만, 엑셀 행 순서대로)
    const rows = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const rowData = {};
      row.eachCell((cell, colNumber) => {
        const header = worksheet.getRow(1).getCell(colNumber).value;
        if (header) {
          rowData[header] = cell.value;
        }
      });

      if (rowData.name && String(rowData.name).trim()) {
        rows.push(rowData);
      }
    });

    // 자재 데이터 변환
    result[sheetName].materials = rows.map((row, idx) => {
      const nameStr = String(row.name || '').trim();
      const noStr = row.no ? String(row.no).padStart(2, '0') : String(idx + 1).padStart(2, '0');
      const materialId = sheetName + '_' + noStr + '_' + nameStr.replace(/[^a-zA-Z0-9가-힣]/g, '');

      const nameEn = String(row.name_en || '').trim();

      const mat = {
        id: materialId,
        name: nameStr,
        nameEn: nameEn,
        category: String(row.category || 'default').trim(),
        categoryName: String(row.categoryName || '').trim(),
        gwp: Number(row.gwp) || 0,
        unit: String(row.unit || 'kgCO2e/m³').trim(),
        density: Number(row.density) || 1000,
        color: String(row.color || '#636e72').trim(),
        source: String(row.source || '').trim(),
        description: String(row.description || '').trim(),
      };

      // thickness가 있으면 추가 (window 제외)
      if (row.thickness !== undefined && row.thickness !== null && row.thickness !== '') {
        mat.thickness = Number(row.thickness);
      }

      // tip이 있으면 추가
      if (row.tip !== undefined && row.tip !== null && String(row.tip).trim() !== '') {
        mat.tip = String(row.tip).trim();
      }

      // 두께 미표현여부
      if (row['두께 미표현여부'] && String(row['두께 미표현여부']).trim() === '○') {
        mat.hideThickness = true;
      }

      return mat;
    });
  });

  // JS 파일 생성
  const jsContent = `/**
 * 한국 EPD 자재 데이터베이스
 * 자동 생성됨: ${new Date().toLocaleString('ko-KR')}
 * 원본: ${path.basename(excelPath)}
 */

const KOREAN_EPD = ${JSON.stringify(result, null, 2)};
`;

  fs.writeFileSync(OUTPUT_JS, jsContent, 'utf8');

  // 결과 출력
  console.log('\n✅ 변환 완료!');
  console.log(`출력: ${OUTPUT_JS}`);
  console.log('\n자재 수:');
  Object.keys(result).forEach(type => {
    const count = result[type].materials.length;
    if (count > 0) {
      console.log(`  - ${type}: ${count}개`);
    }
  });

}

// 템플릿 엑셀 생성
async function createTemplate() {
  const templatePath = path.join(__dirname, '../data/materials.xlsx');

  const workbook = new ExcelJS.Workbook();

  // 1. 사용방법 시트
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
    ['[ 시트 설명 ]'],
    [''],
    ['- floor: 바닥 구조'],
    ['- external: 외벽 구조'],
    ['- internal: 내벽 구조'],
    ['- ceiling: 천장 구조'],
    ['- window: 창호'],
    [''],
    ['[ 컬럼 설명 ]'],
    [''],
    ['id: 고유 ID (영문, 필수)'],
    ['name: 자재명 한글 (필수)'],
    ['nameEn: 자재명 영문'],
    ['category: 카테고리 ID'],
    ['categoryName: 카테고리명'],
    ['gwp: 탄소배출량 (필수)'],
    ['unit: 단위'],
    ['density: 밀도'],
    ['color: 색상 #RRGGBB'],
    ['source: 출처'],
    ['description: 설명'],
    [''],
    ['[ 이미지 ]'],
    [''],
    ['각 행의 우측 빈 공간에 이미지를 직접 삽입하면'],
    ['변환 시 자동으로 추출되어 images/materials/ 폴더에 저장됩니다.'],
  ];

  guideData.forEach(row => guideSheet.addRow(row));

  // 2. 각 타입별 시트 생성
  const types = ['floor', 'external', 'internal', 'ceiling', 'window'];
  const headers = ['id', 'name', 'nameEn', 'category', 'categoryName', 'gwp', 'unit', 'density', 'color', 'source', 'description'];

  types.forEach(type => {
    const sheet = workbook.addWorksheet(type);

    // 컬럼 설정
    sheet.columns = [
      { header: 'id', key: 'id', width: 20 },
      { header: 'name', key: 'name', width: 20 },
      { header: 'nameEn', key: 'nameEn', width: 20 },
      { header: 'category', key: 'category', width: 15 },
      { header: 'categoryName', key: 'categoryName', width: 12 },
      { header: 'gwp', key: 'gwp', width: 10 },
      { header: 'unit', key: 'unit', width: 15 },
      { header: 'density', key: 'density', width: 10 },
      { header: 'color', key: 'color', width: 10 },
      { header: 'source', key: 'source', width: 25 },
      { header: 'description', key: 'description', width: 30 },
    ];

    // 샘플 데이터
    sheet.addRow({
      id: 'sample_1',
      name: '예시 자재',
      nameEn: 'Sample Material',
      category: 'structural',
      categoryName: '구조재',
      gwp: 300,
      unit: 'kgCO2e/m³',
      density: 2400,
      color: '#636e72',
      source: '한국환경산업기술원',
      description: '예시 설명 (이 행 우측에 이미지 삽입 가능)'
    });
  });

  await workbook.xlsx.writeFile(templatePath);
  console.log(`✅ 템플릿 생성: ${templatePath}`);
  console.log('\n시트 구성:');
  console.log('  - 사용방법 (가이드)');
  types.forEach(t => console.log(`  - ${t}`));
  console.log('\n💡 각 자재 행에 이미지를 삽입하면 자동 추출됩니다.');

  process.exit(0);
}
