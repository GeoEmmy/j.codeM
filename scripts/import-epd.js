/**
 * EPD 데이터 → materials.xlsx 변환
 */

const XLSX = require('xlsx');
const path = require('path');

const EPD_PATH = 'z:/02.친환경part/03 기획 과제/25 04 30 LCA설계 가이드라인 _ 김가희/08 환경영향 DB/EPD/환경성적표지 유효인증 제품목록(2024.1.31.)_홈페이지.xlsx';
const OUTPUT_PATH = path.join(__dirname, '../data/materials.xlsx');

// ICE Database 기반 해외 데이터 (이름 10자 이내)
const ICE_DATA = {
  external: [
    { id: 'ice_brick', name: '벽돌', nameEn: 'Brick', category: 'exterior', categoryName: '외장재', gwp: 420, unit: 'kgCO2e/m³', density: 1800, color: '#e17055', source: 'ICE v3', description: 'Common Brick' },
    { id: 'ice_brick_eng', name: '고강도벽돌', nameEn: 'Engineering Brick', category: 'exterior', categoryName: '외장재', gwp: 500, unit: 'kgCO2e/m³', density: 2200, color: '#e17055', source: 'ICE v3', description: 'Engineering Brick' },
    { id: 'ice_limestone', name: '석회암', nameEn: 'Limestone', category: 'exterior', categoryName: '외장재', gwp: 90, unit: 'kgCO2e/m³', density: 2500, color: '#dfe6e9', source: 'ICE v3', description: '' },
    { id: 'ice_granite', name: '화강암', nameEn: 'Granite', category: 'exterior', categoryName: '외장재', gwp: 255, unit: 'kgCO2e/m³', density: 2700, color: '#636e72', source: 'ICE v3', description: '' },
    { id: 'ice_marble', name: '대리석', nameEn: 'Marble', category: 'exterior', categoryName: '외장재', gwp: 220, unit: 'kgCO2e/m³', density: 2700, color: '#dfe6e9', source: 'ICE v3', description: '' },
    { id: 'ice_sandstone', name: '사암', nameEn: 'Sandstone', category: 'exterior', categoryName: '외장재', gwp: 125, unit: 'kgCO2e/m³', density: 2300, color: '#ffeaa7', source: 'ICE v3', description: '' },
    { id: 'ice_alum_sheet', name: '알루미늄판', nameEn: 'Aluminium Sheet', category: 'exterior', categoryName: '외장재', gwp: 23760, unit: 'kgCO2e/m³', density: 2700, color: '#b2bec3', source: 'ICE v3', description: 'Virgin' },
    { id: 'ice_alum_recyc', name: '재생알루미늄', nameEn: 'Recycled Aluminium', category: 'exterior', categoryName: '외장재', gwp: 5130, unit: 'kgCO2e/m³', density: 2700, color: '#b2bec3', source: 'ICE v3', description: 'Recycled' },
    { id: 'ice_steel_clad', name: '스틸패널', nameEn: 'Steel Cladding', category: 'exterior', categoryName: '외장재', gwp: 12480, unit: 'kgCO2e/m³', density: 7800, color: '#636e72', source: 'ICE v3', description: '' },
    { id: 'ice_fiber_cem', name: '섬유시멘트', nameEn: 'Fiber Cement', category: 'exterior', categoryName: '외장재', gwp: 900, unit: 'kgCO2e/m³', density: 1800, color: '#b2bec3', source: 'ICE v3', description: '' },
    { id: 'ice_terracotta', name: '테라코타', nameEn: 'Terracotta', category: 'exterior', categoryName: '외장재', gwp: 720, unit: 'kgCO2e/m³', density: 1800, color: '#e17055', source: 'ICE v3', description: '' },
    { id: 'ice_zinc', name: '아연판', nameEn: 'Zinc', category: 'exterior', categoryName: '외장재', gwp: 24220, unit: 'kgCO2e/m³', density: 7140, color: '#b2bec3', source: 'ICE v3', description: '' },
    { id: 'ice_copper', name: '동판', nameEn: 'Copper', category: 'exterior', categoryName: '외장재', gwp: 26700, unit: 'kgCO2e/m³', density: 8900, color: '#e17055', source: 'ICE v3', description: '' },
  ],
  internal: [
    { id: 'ice_gypsum', name: '석고보드', nameEn: 'Plasterboard', category: 'finishing', categoryName: '마감재', gwp: 195, unit: 'kgCO2e/m³', density: 650, color: '#dfe6e9', source: 'ICE v3', description: '' },
    { id: 'ice_gypsum_fr', name: '내화석고보드', nameEn: 'Fire Resistant', category: 'finishing', categoryName: '마감재', gwp: 234, unit: 'kgCO2e/m³', density: 780, color: '#dfe6e9', source: 'ICE v3', description: '' },
    { id: 'ice_gypsum_mr', name: '방습석고보드', nameEn: 'Moisture Resistant', category: 'finishing', categoryName: '마감재', gwp: 208, unit: 'kgCO2e/m³', density: 690, color: '#74b9ff', source: 'ICE v3', description: '' },
    { id: 'ice_mdf', name: 'MDF', nameEn: 'MDF', category: 'finishing', categoryName: '마감재', gwp: 420, unit: 'kgCO2e/m³', density: 700, color: '#dfe4ea', source: 'ICE v3', description: '' },
    { id: 'ice_plywood', name: '합판', nameEn: 'Plywood', category: 'finishing', categoryName: '마감재', gwp: 350, unit: 'kgCO2e/m³', density: 620, color: '#ffeaa7', source: 'ICE v3', description: '' },
    { id: 'ice_osb', name: 'OSB', nameEn: 'OSB', category: 'finishing', categoryName: '마감재', gwp: 378, unit: 'kgCO2e/m³', density: 630, color: '#ffeaa7', source: 'ICE v3', description: '' },
    { id: 'ice_particle', name: '파티클보드', nameEn: 'Chipboard', category: 'finishing', categoryName: '마감재', gwp: 336, unit: 'kgCO2e/m³', density: 700, color: '#ffeaa7', source: 'ICE v3', description: '' },
    { id: 'ice_paint', name: '페인트', nameEn: 'Paint', category: 'finishing', categoryName: '마감재', gwp: 3750, unit: 'kgCO2e/m³', density: 1500, color: '#74b9ff', source: 'ICE v3', description: '' },
    { id: 'ice_wallpaper', name: '벽지', nameEn: 'Wallpaper', category: 'finishing', categoryName: '마감재', gwp: 1200, unit: 'kgCO2e/m³', density: 400, color: '#dfe6e9', source: 'ICE v3', description: '' },
    { id: 'ice_plaster', name: '석고미장', nameEn: 'Gypsum Plaster', category: 'finishing', categoryName: '마감재', gwp: 117, unit: 'kgCO2e/m³', density: 1300, color: '#dfe6e9', source: 'ICE v3', description: '' },
    { id: 'ice_cem_plast', name: '시멘트미장', nameEn: 'Cement Plaster', category: 'finishing', categoryName: '마감재', gwp: 216, unit: 'kgCO2e/m³', density: 1800, color: '#b2bec3', source: 'ICE v3', description: '' },
    { id: 'ice_steel_stud', name: '스틸스터드', nameEn: 'Steel Stud', category: 'structural', categoryName: '구조재', gwp: 17550, unit: 'kgCO2e/m³', density: 7800, color: '#636e72', source: 'ICE v3', description: '' },
    { id: 'ice_wood_stud', name: '목재스터드', nameEn: 'Timber Stud', category: 'structural', categoryName: '구조재', gwp: 215, unit: 'kgCO2e/m³', density: 500, color: '#ffeaa7', source: 'ICE v3', description: '' },
  ],
  ceiling: [
    { id: 'ice_acoustic', name: '흡음타일', nameEn: 'Acoustic Tile', category: 'finishing', categoryName: '마감재', gwp: 208, unit: 'kgCO2e/m³', density: 320, color: '#dfe6e9', source: 'ICE v3', description: '' },
    { id: 'ice_mineral', name: '미네랄울', nameEn: 'Mineral Wool', category: 'finishing', categoryName: '마감재', gwp: 153, unit: 'kgCO2e/m³', density: 170, color: '#dfe6e9', source: 'ICE v3', description: '' },
    { id: 'ice_metal_ceil', name: '금속천장', nameEn: 'Metal Ceiling', category: 'finishing', categoryName: '마감재', gwp: 4550, unit: 'kgCO2e/m³', density: 2700, color: '#b2bec3', source: 'ICE v3', description: '' },
    { id: 'ice_grid', name: '천장그리드', nameEn: 'Grid System', category: 'structural', categoryName: '구조재', gwp: 12480, unit: 'kgCO2e/m³', density: 7800, color: '#636e72', source: 'ICE v3', description: '' },
    { id: 'ice_gyp_ceil', name: '석고천장', nameEn: 'Gypsum Ceiling', category: 'finishing', categoryName: '마감재', gwp: 195, unit: 'kgCO2e/m³', density: 650, color: '#dfe6e9', source: 'ICE v3', description: '' },
  ],
  window: [
    { id: 'ice_float', name: '판유리', nameEn: 'Float Glass', category: 'glass', categoryName: '유리', gwp: 1890, unit: 'kgCO2e/m³', density: 2500, color: '#81ecec', source: 'ICE v3', description: '' },
    { id: 'ice_tempered', name: '강화유리', nameEn: 'Tempered', category: 'glass', categoryName: '유리', gwp: 2375, unit: 'kgCO2e/m³', density: 2500, color: '#81ecec', source: 'ICE v3', description: '' },
    { id: 'ice_laminated', name: '접합유리', nameEn: 'Laminated', category: 'glass', categoryName: '유리', gwp: 2750, unit: 'kgCO2e/m³', density: 2500, color: '#81ecec', source: 'ICE v3', description: '' },
    { id: 'ice_double', name: '복층유리', nameEn: 'Double Glazing', category: 'glass', categoryName: '유리', gwp: 2125, unit: 'kgCO2e/m³', density: 2500, color: '#74b9ff', source: 'ICE v3', description: '' },
    { id: 'ice_triple', name: '삼중유리', nameEn: 'Triple Glazing', category: 'glass', categoryName: '유리', gwp: 2375, unit: 'kgCO2e/m³', density: 2500, color: '#74b9ff', source: 'ICE v3', description: '' },
    { id: 'ice_lowe', name: 'Low-E유리', nameEn: 'Low-E Glass', category: 'glass', categoryName: '유리', gwp: 2500, unit: 'kgCO2e/m³', density: 2500, color: '#74b9ff', source: 'ICE v3', description: '' },
    { id: 'ice_pvc_fr', name: 'PVC프레임', nameEn: 'PVC Frame', category: 'frame', categoryName: '프레임', gwp: 4095, unit: 'kgCO2e/m³', density: 1350, color: '#dfe6e9', source: 'ICE v3', description: '' },
    { id: 'ice_al_fr', name: '알루미늄프레임', nameEn: 'Aluminium Frame', category: 'frame', categoryName: '프레임', gwp: 23760, unit: 'kgCO2e/m³', density: 2700, color: '#b2bec3', source: 'ICE v3', description: '' },
    { id: 'ice_wood_fr', name: '목재프레임', nameEn: 'Timber Frame', category: 'frame', categoryName: '프레임', gwp: 215, unit: 'kgCO2e/m³', density: 500, color: '#ffeaa7', source: 'ICE v3', description: '' },
    { id: 'ice_steel_fr', name: '스틸프레임', nameEn: 'Steel Frame', category: 'frame', categoryName: '프레임', gwp: 17550, unit: 'kgCO2e/m³', density: 7800, color: '#636e72', source: 'ICE v3', description: '' },
  ],
  floor: [
    { id: 'ice_con25', name: '콘크리트25', nameEn: 'Concrete 25MPa', category: 'structural', categoryName: '구조재', gwp: 240, unit: 'kgCO2e/m³', density: 2400, color: '#636e72', source: 'ICE v3', description: '25MPa' },
    { id: 'ice_con30', name: '콘크리트30', nameEn: 'Concrete 30MPa', category: 'structural', categoryName: '구조재', gwp: 264, unit: 'kgCO2e/m³', density: 2400, color: '#636e72', source: 'ICE v3', description: '30MPa' },
    { id: 'ice_con40', name: '콘크리트40', nameEn: 'Concrete 40MPa', category: 'structural', categoryName: '구조재', gwp: 312, unit: 'kgCO2e/m³', density: 2400, color: '#636e72', source: 'ICE v3', description: '40MPa' },
    { id: 'ice_rebar', name: '철근', nameEn: 'Steel Rebar', category: 'structural', categoryName: '구조재', gwp: 12090, unit: 'kgCO2e/m³', density: 7850, color: '#636e72', source: 'ICE v3', description: '' },
    { id: 'ice_struct_st', name: '구조용강재', nameEn: 'Structural Steel', category: 'structural', categoryName: '구조재', gwp: 17550, unit: 'kgCO2e/m³', density: 7800, color: '#636e72', source: 'ICE v3', description: '' },
    { id: 'ice_screed', name: '스크리드', nameEn: 'Screed', category: 'finishing', categoryName: '마감재', gwp: 234, unit: 'kgCO2e/m³', density: 1800, color: '#b2bec3', source: 'ICE v3', description: '' },
    { id: 'ice_ceramic', name: '세라믹타일', nameEn: 'Ceramic Tile', category: 'finishing', categoryName: '마감재', gwp: 1430, unit: 'kgCO2e/m³', density: 2200, color: '#dfe6e9', source: 'ICE v3', description: '' },
    { id: 'ice_porcelain', name: '포세린타일', nameEn: 'Porcelain', category: 'finishing', categoryName: '마감재', gwp: 1540, unit: 'kgCO2e/m³', density: 2200, color: '#dfe6e9', source: 'ICE v3', description: '' },
    { id: 'ice_hardwood', name: '원목마루', nameEn: 'Hardwood', category: 'finishing', categoryName: '마감재', gwp: 350, unit: 'kgCO2e/m³', density: 700, color: '#ffeaa7', source: 'ICE v3', description: '' },
    { id: 'ice_laminate', name: '강화마루', nameEn: 'Laminate', category: 'finishing', categoryName: '마감재', gwp: 672, unit: 'kgCO2e/m³', density: 840, color: '#ffeaa7', source: 'ICE v3', description: '' },
    { id: 'ice_vinyl', name: '비닐바닥', nameEn: 'Vinyl', category: 'finishing', categoryName: '마감재', gwp: 4200, unit: 'kgCO2e/m³', density: 1400, color: '#74b9ff', source: 'ICE v3', description: '' },
    { id: 'ice_carpet', name: '카펫', nameEn: 'Carpet', category: 'finishing', categoryName: '마감재', gwp: 1110, unit: 'kgCO2e/m³', density: 370, color: '#a29bfe', source: 'ICE v3', description: '' },
    { id: 'ice_eps', name: 'EPS', nameEn: 'EPS', category: 'insulation', categoryName: '단열재', gwp: 110, unit: 'kgCO2e/m³', density: 25, color: '#fdcb6e', source: 'ICE v3', description: '' },
    { id: 'ice_xps', name: 'XPS', nameEn: 'XPS', category: 'insulation', categoryName: '단열재', gwp: 115, unit: 'kgCO2e/m³', density: 35, color: '#fdcb6e', source: 'ICE v3', description: '' },
    { id: 'ice_pir', name: 'PIR', nameEn: 'PIR', category: 'insulation', categoryName: '단열재', gwp: 126, unit: 'kgCO2e/m³', density: 32, color: '#fdcb6e', source: 'ICE v3', description: '' },
    { id: 'ice_glasswool', name: '유리면', nameEn: 'Glass Wool', category: 'insulation', categoryName: '단열재', gwp: 38, unit: 'kgCO2e/m³', density: 25, color: '#fdcb6e', source: 'ICE v3', description: '' },
    { id: 'ice_rockwool', name: '암면', nameEn: 'Rock Wool', category: 'insulation', categoryName: '단열재', gwp: 51, unit: 'kgCO2e/m³', density: 50, color: '#fdcb6e', source: 'ICE v3', description: '' },
  ]
};

// 분류 규칙
const CLASSIFICATION = {
  floor: {
    keywords: ['콘크리트', '레디믹스', '바닥', '마루', '타일', '몰탈', '모르타르', '슬래브', 'OPC', '시멘트'],
    exclude: ['벽', '지붕', '창']
  },
  external: {
    keywords: ['벽돌', '외벽', 'ALC', '패널', '사이딩', '외장', '석재', '화강', '대리석', '금속패널', '알루미늄', '커튼월'],
    exclude: ['내벽', '칸막이']
  },
  internal: {
    keywords: ['석고보드', '내벽', '칸막이', '파티션', '천장재', '텍스'],
    exclude: ['외벽']
  },
  ceiling: {
    keywords: ['천장', '텍스', '흡음', '아코스틱', '우물천장'],
    exclude: []
  },
  window: {
    keywords: ['유리', '창호', '창문', '복층', '로이', 'Low-E', '삼중', '이중', 'PVC창', '알루미늄창'],
    exclude: []
  },
  insulation: {
    keywords: ['단열', '보드', 'EPS', 'XPS', '우레탄', '글라스울', '미네랄울', '암면', '스티로폼', 'PIR', 'PF보드', 'PUR', '비드법', '압출법'],
    exclude: []
  }
};

// 카테고리 매핑
function classifyMaterial(name, group) {
  const text = (name + ' ' + group).toLowerCase();

  // 단열재 우선 체크 (여러 구조에 사용되므로)
  for (const kw of CLASSIFICATION.insulation.keywords) {
    if (text.includes(kw.toLowerCase())) {
      return { type: 'floor', category: 'insulation', categoryName: '단열재' }; // 단열재는 일단 floor에
    }
  }

  // 창호
  for (const kw of CLASSIFICATION.window.keywords) {
    if (text.includes(kw.toLowerCase())) {
      return { type: 'window', category: 'glass', categoryName: '유리' };
    }
  }

  // 천장
  for (const kw of CLASSIFICATION.ceiling.keywords) {
    if (text.includes(kw.toLowerCase())) {
      return { type: 'ceiling', category: 'finishing', categoryName: '마감재' };
    }
  }

  // 외벽
  for (const kw of CLASSIFICATION.external.keywords) {
    if (text.includes(kw.toLowerCase())) {
      const excluded = CLASSIFICATION.external.exclude.some(e => text.includes(e.toLowerCase()));
      if (!excluded) {
        return { type: 'external', category: 'exterior', categoryName: '외장재' };
      }
    }
  }

  // 내벽
  for (const kw of CLASSIFICATION.internal.keywords) {
    if (text.includes(kw.toLowerCase())) {
      return { type: 'internal', category: 'finishing', categoryName: '마감재' };
    }
  }

  // 바닥 (콘크리트 등)
  for (const kw of CLASSIFICATION.floor.keywords) {
    if (text.includes(kw.toLowerCase())) {
      if (text.includes('콘크리트') || text.includes('시멘트') || text.includes('레디믹스')) {
        return { type: 'floor', category: 'structural', categoryName: '구조재' };
      }
      return { type: 'floor', category: 'finishing', categoryName: '마감재' };
    }
  }

  return null;
}

// 단위 → m³ 변환
function normalizeToM3(gwp, unit, density = 1000) {
  const u = unit.toLowerCase().replace(/\s/g, '');

  // 이미 m³ 단위
  if (u.includes('m3') || u.includes('m³') || u.includes('㎥')) {
    return { gwp, unit: 'kgCO2e/m³' };
  }

  // m² → m³ (두께 1m 가정, 실제로는 얇은 자재이므로 그대로 사용)
  if (u.includes('m2') || u.includes('m²') || u.includes('㎡')) {
    // m² 단위 자재는 보통 얇은 마감재 (타일, 시트 등)
    // 일반적으로 두께 10mm 가정 → 0.01m
    // gwp/m² × 100 = gwp/m³ (두께 10mm 기준)
    const converted = gwp * 100; // 10mm 두께 가정
    return { gwp: Math.round(converted * 100) / 100, unit: 'kgCO2e/m³' };
  }

  // kg → m³ (밀도 사용)
  if (u.includes('/kg') || u.includes('/㎏')) {
    // 1 m³ = density kg
    const converted = gwp * density;
    return { gwp: Math.round(converted * 100) / 100, unit: 'kgCO2e/m³' };
  }

  // ton → m³ (밀도 사용)
  if (u.includes('ton') || u.includes('톤')) {
    // 1 ton = 1000 kg, 1 m³ = density kg
    const converted = gwp * (density / 1000);
    return { gwp: Math.round(converted * 100) / 100, unit: 'kgCO2e/m³' };
  }

  // 개, box, 포대 등 → 제외 (변환 불가)
  if (u.includes('개') || u.includes('box') || u.includes('포대') || u.includes('ea')) {
    return null; // 변환 불가, 제외
  }

  // 기타는 그대로
  return { gwp, unit: 'kgCO2e/m³' };
}

// 밀도 추정 (단위 변환용)
function estimateDensity(name, category) {
  const text = name.toLowerCase();

  // 콘크리트
  if (text.includes('콘크리트') || text.includes('레디믹스')) return 2400;
  // 철/강재
  if (text.includes('철근') || text.includes('강재') || text.includes('스틸')) return 7850;
  // 알루미늄
  if (text.includes('알루미늄')) return 2700;
  // 유리
  if (text.includes('유리')) return 2500;
  // 목재/합판
  if (text.includes('목재') || text.includes('합판') || text.includes('마루')) return 600;
  // 단열재 (EPS, XPS 등)
  if (text.includes('eps') || text.includes('비드법')) return 25;
  if (text.includes('xps') || text.includes('압출법')) return 35;
  if (text.includes('우레탄') || text.includes('pur')) return 35;
  if (text.includes('글라스울') || text.includes('유리면')) return 25;
  if (text.includes('미네랄') || text.includes('암면')) return 50;
  // 석고보드
  if (text.includes('석고')) return 700;
  // 벽돌
  if (text.includes('벽돌')) return 1800;
  // 타일
  if (text.includes('타일')) return 2200;
  // 시멘트/모르타르
  if (text.includes('시멘트') || text.includes('몰탈') || text.includes('모르타르')) return 1800;

  // 기본값
  return 1000;
}

// 색상 매핑
function getColor(category) {
  const colors = {
    structural: '#636e72',
    insulation: '#fdcb6e',
    finishing: '#74b9ff',
    exterior: '#e17055',
    glass: '#81ecec',
    frame: '#a29bfe'
  };
  return colors[category] || '#b2bec3';
}

// ID 생성
function makeId(name, index) {
  const base = name
    .replace(/[\[\]()]/g, '')
    .replace(/[^a-zA-Z0-9가-힣]/g, '_')
    .substring(0, 30);
  return `epd_${index}_${base}`;
}

// 이름 짧게 정리
function shortenName(name, gwp) {
  let short = name
    // 괄호/대괄호 내용 제거
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    // 브랜드 정리
    .replace(/Z:IN\s?Floor\s?/gi, '')
    .replace(/Z:IN\s?/gi, '')
    .replace(/골드타일\s?/g, '')
    .replace(/WINCHE\s?/gi, '')
    .replace(/Hugreen\s?/gi, '')
    .replace(/PNS\s?/gi, '')
    .replace(/현대L&C\s?/gi, '')
    .replace(/KCC\s?/gi, '')
    // 단열재 정리
    .replace(/경질\s?폴리우레탄폼\s?단열재/g, 'PUR단열재')
    .replace(/경질\s?발포\s?플라스틱\s?/g, '')
    .replace(/건축물\s?단열재\s?/g, '')
    .replace(/비드법\s?단열재/g, 'EPS')
    .replace(/압출법\s?단열재/g, 'XPS')
    // 콘크리트 정리
    .replace(/레디믹스트\s?콘크리트/g, '콘크리트')
    .replace(/레디믹스트\s?/g, '')
    // 기타 정리
    .replace(/준불연\s?/g, '')
    .replace(/유효인증\s?/g, '')
    .replace(/창호\s?/g, '')
    .replace(/프로파일/g, '프레임')
    .replace(/\s*-\s*/g, ' ')
    .replace(/\d종\d호/g, '')
    .replace(/\d종/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // 최대 10자로 제한
  if (short.length > 10) {
    short = short.substring(0, 9) + '…';
  }

  return short || name.substring(0, 10);
}

// 메인
function main() {
  console.log('EPD 파일 읽는 중...');
  const wb = XLSX.readFile(EPD_PATH);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const results = {
    floor: [],
    external: [],
    internal: [],
    ceiling: [],
    window: []
  };

  let count = 0;
  const seen = new Set(); // 중복 제거용

  rawData.slice(6).forEach((row, i) => {
    const productName = String(row[7] || '').trim();
    const productGroup = String(row[6] || '').trim();
    const gwp = row[14];
    const unit = String(row[15] || '').trim();
    const company = String(row[1] || '').trim();

    if (!productName || !gwp || isNaN(Number(gwp))) return;

    // 분류
    const classification = classifyMaterial(productName, productGroup);
    if (!classification) return;

    // 중복 제거 (이름 + GWP값으로 판단)
    // 같은 이름이면 GWP 평균값만 사용
    const nameKey = productName.replace(/\[.*?\]/g, '').trim().toLowerCase();
    if (seen.has(nameKey)) return;
    seen.add(nameKey);

    // 밀도 추정
    const density = estimateDensity(productName, classification.category);

    // m³ 단위로 변환
    const normalized = normalizeToM3(Number(gwp), unit, density);
    if (!normalized) return; // 변환 불가 (개, box 등) 제외

    const material = {
      id: makeId(productName, count++),
      name: shortenName(productName),
      nameEn: '',
      category: classification.category,
      categoryName: classification.categoryName,
      gwp: normalized.gwp,
      unit: normalized.unit,
      density: density,
      color: getColor(classification.category),
      source: '환경성적표지(' + company + ')',
      description: productName  // 원본 이름은 description에 보관
    };

    results[classification.type].push(material);
  });

  // ICE 데이터 병합 (먼저 수행)
  const types = ['floor', 'external', 'internal', 'ceiling', 'window'];
  console.log('\nICE 데이터 병합 중...');
  types.forEach(type => {
    if (ICE_DATA[type]) {
      ICE_DATA[type].forEach(material => {
        // 중복 체크 (이름 기준)
        const exists = results[type].some(m =>
          m.name.toLowerCase().includes(material.name.toLowerCase()) ||
          material.name.toLowerCase().includes(m.name.toLowerCase())
        );
        if (!exists) {
          results[type].push(material);
        }
      });
    }
  });

  // 엑셀 생성
  const newWb = XLSX.utils.book_new();

  // 사용방법 시트
  const guide = [
    ['[ 변환 방법 ]'],
    [''],
    ['1. 이 엑셀 파일에서 자재 데이터를 수정합니다.'],
    ['2. 터미널에서: npm run db:convert'],
    ['3. data/epd-korea.js 자동 생성'],
    ['4. 웹 새로고침'],
    [''],
    ['[ 데이터 출처 ]'],
    ['- 환경성적표지 유효인증 제품목록 (2024.01.31)'],
    ['- ICE Database v3 (Circular Ecology)']
  ];
  const guideWs = XLSX.utils.aoa_to_sheet(guide);
  guideWs['!cols'] = [{ wch: 50 }];
  XLSX.utils.book_append_sheet(newWb, guideWs, '사용방법');

  // 각 타입별 시트
  types.forEach(type => {
    if (results[type].length > 0) {
      const ws = XLSX.utils.json_to_sheet(results[type]);
      ws['!cols'] = [
        { wch: 25 }, { wch: 40 }, { wch: 20 }, { wch: 15 },
        { wch: 12 }, { wch: 10 }, { wch: 18 }, { wch: 10 },
        { wch: 10 }, { wch: 30 }, { wch: 30 }
      ];
      XLSX.utils.book_append_sheet(newWb, ws, type);
    }
  });

  XLSX.writeFile(newWb, OUTPUT_PATH);

  console.log('\n✅ 완료:', OUTPUT_PATH);
  console.log('\n자재 수:');
  types.forEach(t => {
    console.log(`  ${t}: ${results[t].length}개`);
  });
  console.log(`  총: ${Object.values(results).flat().length}개`);
}

main();
