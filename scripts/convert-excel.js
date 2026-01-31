/**
 * 엑셀 → epd-korea.js 변환 스크립트
 *
 * 사용법: node scripts/convert-excel.js [엑셀파일경로]
 * 예시: node scripts/convert-excel.js data/materials.xlsx
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 기본 파일 경로
const DEFAULT_EXCEL = path.join(__dirname, '../data/materials.xlsx');
const OUTPUT_JS = path.join(__dirname, '../data/epd-korea.js');

// 템플릿 생성 옵션 (먼저 체크)
if (process.argv[2] === '--template') {
  createTemplate();
  process.exit(0);
}

// 엑셀 파일 경로 (인자로 받거나 기본값)
const excelPath = process.argv[2] || DEFAULT_EXCEL;

// 파일 존재 확인
if (!fs.existsSync(excelPath)) {
  console.error(`파일을 찾을 수 없습니다: ${excelPath}`);
  console.log('\n템플릿 생성: npm run db:template');
  process.exit(1);
}

// 메인 변환 함수
function convertExcelToJS() {
  console.log(`변환 중: ${excelPath}`);

  const workbook = XLSX.readFile(excelPath);
  const result = {
    floor: { materials: [] },
    external: { materials: [] },
    internal: { materials: [] },
    ceiling: { materials: [] },
    window: { materials: [] }
  };

  // 각 시트를 structureType으로 처리
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // 시트 이름이 structureType이면 해당 타입에 추가
    const structureType = sheetName.toLowerCase();
    if (result[structureType]) {
      result[structureType].materials = data.map(row => ({
        id: String(row.id || '').trim(),
        name: String(row.name || '').trim(),
        nameEn: String(row.nameEn || '').trim(),
        category: String(row.category || 'default').trim(),
        categoryName: String(row.categoryName || '').trim(),
        gwp: Number(row.gwp) || 0,
        unit: String(row.unit || 'kg CO2eq/m³').trim(),
        density: Number(row.density) || 1000,
        color: String(row.color || '#636e72').trim(),
        source: String(row.source || '').trim(),
        description: String(row.description || '').trim()
      }));
    }
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
function createTemplate() {
  const templatePath = path.join(__dirname, '../data/materials.xlsx');

  const wb = XLSX.utils.book_new();

  // 1. 사용방법 시트 (맨 앞에)
  const guideData = [
    ['[ 변환 방법 ]'],
    [''],
    ['1. 이 엑셀 파일에서 자재 데이터를 수정합니다.'],
    ['2. 터미널에서 아래 명령어 실행:'],
    ['   npm run db:convert'],
    ['3. data/epd-korea.js 파일이 자동 생성됩니다.'],
    ['4. 웹 새로고침하면 반영됩니다.'],
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
    ['category: 카테고리 ID (structural, insulation, finishing 등)'],
    ['categoryName: 카테고리명 (구조재, 단열재, 마감재 등)'],
    ['gwp: 탄소배출량 숫자 (필수)'],
    ['unit: 단위 (기본값: kg CO2eq/m³)'],
    ['density: 밀도 (기본값: 1000)'],
    ['color: 색상 #RRGGBB (기본값: #636e72)'],
    ['source: 데이터 출처'],
    ['description: 설명'],
  ];
  const guideWs = XLSX.utils.aoa_to_sheet(guideData);
  guideWs['!cols'] = [{ wch: 60 }];
  XLSX.utils.book_append_sheet(wb, guideWs, '사용방법');

  // 2. 각 structureType별 시트 생성
  const types = ['floor', 'external', 'internal', 'ceiling', 'window'];
  const sampleData = [
    {
      id: 'sample_1',
      name: '예시 자재',
      nameEn: 'Sample Material',
      category: 'structural',
      categoryName: '구조재',
      gwp: 300,
      unit: 'kg CO2eq/m³',
      density: 2400,
      color: '#636e72',
      source: '한국환경산업기술원',
      description: '예시 설명'
    }
  ];

  types.forEach(type => {
    const ws = XLSX.utils.json_to_sheet(sampleData);
    ws['!cols'] = [
      { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 },
      { wch: 12 }, { wch: 8 }, { wch: 15 }, { wch: 10 },
      { wch: 10 }, { wch: 20 }, { wch: 30 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, type);
  });

  XLSX.writeFile(wb, templatePath);
  console.log(`✅ 템플릿 생성: ${templatePath}`);
  console.log('\n시트 구성:');
  console.log('  - 사용방법 (가이드)');
  types.forEach(t => console.log(`  - ${t}`));
}

// 실행
convertExcelToJS();
