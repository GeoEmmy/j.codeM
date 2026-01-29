// 국내 EPD 데이터 (한국환경산업기술원 기준)
// GWP: Global Warming Potential (kg CO2eq/m³ or kg CO2eq/kg)
// 단위: kg CO2eq/m³ (부피 기준) 또는 kg CO2eq/kg (무게 기준)

const KOREAN_EPD = {
  floor: {
    // 바닥 구조체
    materials: [
      {
        id: 'concrete_c24',
        name: '콘크리트 C24/30',
        nameEn: 'Concrete C24/30',
        category: 'structural',
        categoryName: '구조재',
        gwp: 315,
        unit: 'kg CO2eq/m³',
        density: 2400, // kg/m³
        color: '#636e72',
        source: '한국환경산업기술원',
        description: '보통 콘크리트 슬래브용'
      },
      {
        id: 'concrete_c30',
        name: '콘크리트 C30/37',
        nameEn: 'Concrete C30/37',
        category: 'structural',
        categoryName: '구조재',
        gwp: 350,
        unit: 'kg CO2eq/m³',
        density: 2400,
        color: '#2d3436',
        source: '한국환경산업기술원',
        description: '고강도 콘크리트'
      },
      {
        id: 'xps_insulation',
        name: '압출법 단열재 (XPS)',
        nameEn: 'XPS Insulation',
        category: 'insulation',
        categoryName: '단열재',
        gwp: 282,
        unit: 'kg CO2eq/m³',
        density: 30,
        color: '#74b9ff',
        source: '한국환경산업기술원',
        description: '압출 발포 폴리스티렌'
      },
      {
        id: 'eps_insulation',
        name: '비드법 단열재 (EPS)',
        nameEn: 'EPS Insulation',
        category: 'insulation',
        categoryName: '단열재',
        gwp: 94,
        unit: 'kg CO2eq/m³',
        density: 20,
        color: '#a29bfe',
        source: '한국환경산업기술원',
        description: '비드 발포 폴리스티렌'
      },
      {
        id: 'glasswool',
        name: '유리면 단열재',
        nameEn: 'Glass Wool',
        category: 'insulation',
        categoryName: '단열재',
        gwp: 68,
        unit: 'kg CO2eq/m³',
        density: 24,
        color: '#fdcb6e',
        source: '한국환경산업기술원',
        description: '유리섬유 단열재'
      },
      {
        id: 'rockwool',
        name: '암면 단열재',
        nameEn: 'Rock Wool',
        category: 'insulation',
        categoryName: '단열재',
        gwp: 93,
        unit: 'kg CO2eq/m³',
        density: 100,
        color: '#e17055',
        source: '한국환경산업기술원',
        description: '현무암 섬유 단열재'
      },
      {
        id: 'mortar',
        name: '시멘트 모르타르',
        nameEn: 'Cement Mortar',
        category: 'finishing',
        categoryName: '마감재',
        gwp: 235,
        unit: 'kg CO2eq/m³',
        density: 2000,
        color: '#dfe6e9',
        source: '한국환경산업기술원',
        description: '시멘트 몰탈'
      },
      {
        id: 'wood_floor',
        name: '강마루 (강화마루)',
        nameEn: 'Laminate Flooring',
        category: 'finishing',
        categoryName: '마감재',
        gwp: -420,
        unit: 'kg CO2eq/m³',
        density: 800,
        color: '#d63031',
        source: '한국환경산업기술원',
        description: 'HDF 기반 강화마루'
      },
      {
        id: 'engineered_wood',
        name: '원목마루 (엔지니어드)',
        nameEn: 'Engineered Wood Floor',
        category: 'finishing',
        categoryName: '마감재',
        gwp: -535,
        unit: 'kg CO2eq/m³',
        density: 650,
        color: '#6c5ce7',
        source: '한국환경산업기술원',
        description: '원목 복합마루'
      },
      {
        id: 'ceramic_tile',
        name: '세라믹 타일',
        nameEn: 'Ceramic Tile',
        category: 'finishing',
        categoryName: '마감재',
        gwp: 694,
        unit: 'kg CO2eq/m³',
        density: 2000,
        color: '#00b894',
        source: '한국환경산업기술원',
        description: '바닥용 세라믹 타일'
      }
    ]
  },

  external: {
    // 외벽 구조체
    materials: [
      {
        id: 'brick_red',
        name: '적벽돌',
        nameEn: 'Red Brick',
        category: 'exterior',
        categoryName: '외장재',
        gwp: 297,
        unit: 'kg CO2eq/m³',
        density: 1800,
        color: '#d63031',
        source: '한국환경산업기술원',
        description: '소성 점토 벽돌'
      },
      {
        id: 'alc_block',
        name: 'ALC 블록',
        nameEn: 'ALC Block',
        category: 'structural',
        categoryName: '구조재',
        gwp: 91,
        unit: 'kg CO2eq/m³',
        density: 500,
        color: '#b2bec3',
        source: '한국환경산업기술원',
        description: '경량 기포 콘크리트'
      },
      {
        id: 'concrete_block',
        name: '콘크리트 블록',
        nameEn: 'Concrete Block',
        category: 'structural',
        categoryName: '구조재',
        gwp: 180,
        unit: 'kg CO2eq/m³',
        density: 1400,
        color: '#636e72',
        source: '한국환경산업기술원',
        description: '중공 콘크리트 블록'
      },
      {
        id: 'xps_exterior',
        name: '외단열 XPS',
        nameEn: 'XPS External Insulation',
        category: 'insulation',
        categoryName: '단열재',
        gwp: 282,
        unit: 'kg CO2eq/m³',
        density: 30,
        color: '#74b9ff',
        source: '한국환경산업기술원',
        description: '압출법 외단열재'
      },
      {
        id: 'eps_exterior',
        name: '외단열 EPS',
        nameEn: 'EPS External Insulation',
        category: 'insulation',
        categoryName: '단열재',
        gwp: 94,
        unit: 'kg CO2eq/m³',
        density: 20,
        color: '#a29bfe',
        source: '한국환경산업기술원',
        description: '비드법 외단열재'
      },
      {
        id: 'mineral_wool',
        name: '미네랄울 (외단열)',
        nameEn: 'Mineral Wool',
        category: 'insulation',
        categoryName: '단열재',
        gwp: 93,
        unit: 'kg CO2eq/m³',
        density: 100,
        color: '#fdcb6e',
        source: '한국환경산업기술원',
        description: '암면 외단열재'
      },
      {
        id: 'concrete_wall',
        name: '철근콘크리트 벽체',
        nameEn: 'RC Wall',
        category: 'structural',
        categoryName: '구조재',
        gwp: 350,
        unit: 'kg CO2eq/m³',
        density: 2400,
        color: '#2d3436',
        source: '한국환경산업기술원',
        description: '철근 콘크리트 구조벽'
      },
      {
        id: 'gypsum_board',
        name: '석고보드',
        nameEn: 'Gypsum Board',
        category: 'finishing',
        categoryName: '마감재',
        gwp: 93,
        unit: 'kg CO2eq/m³',
        density: 800,
        color: '#dfe6e9',
        source: '한국환경산업기술원',
        description: '내부 마감용 석고보드'
      },
      {
        id: 'cement_plaster',
        name: '시멘트 미장',
        nameEn: 'Cement Plaster',
        category: 'finishing',
        categoryName: '마감재',
        gwp: 187,
        unit: 'kg CO2eq/m³',
        density: 1800,
        color: '#b2bec3',
        source: '한국환경산업기술원',
        description: '시멘트 미장'
      },
      {
        id: 'paint',
        name: '수성페인트',
        nameEn: 'Water-based Paint',
        category: 'finishing',
        categoryName: '마감재',
        gwp: 260,
        unit: 'kg CO2eq/m³',
        density: 1200,
        color: '#ffffff',
        source: '한국환경산업기술원',
        description: '내부 마감 페인트'
      },
      {
        id: 'granite_panel',
        name: '화강석 패널',
        nameEn: 'Granite Panel',
        category: 'exterior',
        categoryName: '외장재',
        gwp: 450,
        unit: 'kg CO2eq/m³',
        density: 2650,
        color: '#636e72',
        source: '한국환경산업기술원',
        description: '천연석 외장재'
      },
      {
        id: 'metal_panel',
        name: '금속패널 (알루미늄)',
        nameEn: 'Metal Panel (Aluminum)',
        category: 'exterior',
        categoryName: '외장재',
        gwp: 28890,
        unit: 'kg CO2eq/m³',
        density: 2700,
        color: '#95a5a6',
        source: '한국환경산업기술원',
        description: '알루미늄 외장패널'
      }
    ]
  },

  internal: {
    // 내벽 구조체
    materials: [
      {
        id: 'gypsum_board_internal',
        name: '석고보드 12.5T',
        nameEn: 'Gypsum Board 12.5mm',
        category: 'finishing',
        categoryName: '마감재',
        gwp: 93,
        unit: 'kg CO2eq/m³',
        density: 800,
        color: '#dfe6e9',
        source: '한국환경산업기술원',
        description: '일반 석고보드'
      },
      {
        id: 'gypsum_board_fire',
        name: '방화석고보드',
        nameEn: 'Fire-resistant Gypsum Board',
        category: 'finishing',
        categoryName: '마감재',
        gwp: 110,
        unit: 'kg CO2eq/m³',
        density: 900,
        color: '#fab1a0',
        source: '한국환경산업기술원',
        description: '내화 석고보드'
      },
      {
        id: 'steel_stud',
        name: '경량철골 (스터드)',
        nameEn: 'Steel Stud',
        category: 'structural',
        categoryName: '구조재',
        gwp: 2800,
        unit: 'kg CO2eq/m³',
        density: 7850,
        color: '#2d3436',
        source: '한국환경산업기술원',
        description: '경량 철골 프레임'
      },
      {
        id: 'wood_stud',
        name: '목재 스터드',
        nameEn: 'Wood Stud',
        category: 'structural',
        categoryName: '구조재',
        gwp: -680,
        unit: 'kg CO2eq/m³',
        density: 500,
        color: '#d63031',
        source: '한국환경산업기술원',
        description: '구조용 목재'
      },
      {
        id: 'glasswool_internal',
        name: '유리면 충진재',
        nameEn: 'Glass Wool Insulation',
        category: 'insulation',
        categoryName: '단열/흡음재',
        gwp: 68,
        unit: 'kg CO2eq/m³',
        density: 24,
        color: '#fdcb6e',
        source: '한국환경산업기술원',
        description: '내부 단열/흡음'
      },
      {
        id: 'rockwool_internal',
        name: '암면 흡음재',
        nameEn: 'Rock Wool Insulation',
        category: 'insulation',
        categoryName: '단열/흡음재',
        gwp: 93,
        unit: 'kg CO2eq/m³',
        density: 50,
        color: '#e17055',
        source: '한국환경산업기술원',
        description: '방음/흡음 암면'
      },
      {
        id: 'brick_internal',
        name: '적벽돌 (내벽)',
        nameEn: 'Red Brick (Interior)',
        category: 'structural',
        categoryName: '구조재',
        gwp: 297,
        unit: 'kg CO2eq/m³',
        density: 1800,
        color: '#d63031',
        source: '한국환경산업기술원',
        description: '내부 조적벽'
      },
      {
        id: 'concrete_block_internal',
        name: '콘크리트 블록 (내벽)',
        nameEn: 'Concrete Block (Interior)',
        category: 'structural',
        categoryName: '구조재',
        gwp: 180,
        unit: 'kg CO2eq/m³',
        density: 1400,
        color: '#636e72',
        source: '한국환경산업기술원',
        description: '내부 블록 벽'
      },
      {
        id: 'wallpaper',
        name: '벽지 (실크)',
        nameEn: 'Wallpaper',
        category: 'finishing',
        categoryName: '마감재',
        gwp: 420,
        unit: 'kg CO2eq/m³',
        density: 300,
        color: '#fab1a0',
        source: '한국환경산업기술원',
        description: '비닐 벽지'
      },
      {
        id: 'tile_internal',
        name: '세라믹 타일 (벽)',
        nameEn: 'Ceramic Tile (Wall)',
        category: 'finishing',
        categoryName: '마감재',
        gwp: 694,
        unit: 'kg CO2eq/m³',
        density: 2000,
        color: '#00b894',
        source: '한국환경산업기술원',
        description: '벽타일'
      }
    ]
  },

  ceiling: {
    // 천장 마감 구조
    materials: [
      {
        id: 'steel_stud_ceiling',
        name: '경량철골 스터드 (C형강)',
        nameEn: 'Steel Stud (C-Channel)',
        category: 'structural',
        categoryName: '달대',
        gwp: 2800,
        unit: 'kg CO2eq/m³',
        density: 7850,
        color: '#c0c0c0',
        source: '한국환경산업기술원',
        description: '천장 달대용 경량철골'
      },
      {
        id: 'gypsum_board_9.5',
        name: '석고보드 9.5T',
        nameEn: 'Gypsum Board 9.5mm',
        category: 'finishing',
        categoryName: '천장재',
        gwp: 93,
        unit: 'kg CO2eq/m³',
        density: 800,
        color: '#f5f5f5',
        source: '한국환경산업기술원',
        description: '일반 천장 석고보드 9.5mm'
      },
      {
        id: 'gypsum_board_12.5',
        name: '석고보드 12.5T',
        nameEn: 'Gypsum Board 12.5mm',
        category: 'finishing',
        categoryName: '천장재',
        gwp: 93,
        unit: 'kg CO2eq/m³',
        density: 800,
        color: '#f5f5f5',
        source: '한국환경산업기술원',
        description: '일반 천장 석고보드 12.5mm'
      },
      {
        id: 'gypsum_board_fire_ceiling',
        name: '방화석고보드',
        nameEn: 'Fire-resistant Gypsum Board',
        category: 'finishing',
        categoryName: '천장재',
        gwp: 110,
        unit: 'kg CO2eq/m³',
        density: 900,
        color: '#fab1a0',
        source: '한국환경산업기술원',
        description: '내화 성능 천장 석고보드'
      },
      {
        id: 'acoustic_board',
        name: '흡음 텍스',
        nameEn: 'Acoustic Ceiling Tile',
        category: 'finishing',
        categoryName: '천장재',
        gwp: 85,
        unit: 'kg CO2eq/m³',
        density: 350,
        color: '#dfe6e9',
        source: '한국환경산업기술원',
        description: '사무실용 흡음 천장재'
      },
      {
        id: 'mineral_fiber_ceiling',
        name: '미네랄파이버 천장재',
        nameEn: 'Mineral Fiber Ceiling',
        category: 'finishing',
        categoryName: '천장재',
        gwp: 75,
        unit: 'kg CO2eq/m³',
        density: 300,
        color: '#ffeaa7',
        source: '한국환경산업기술원',
        description: '미네랄울 기반 천장재'
      }
    ]
  },

  window: {
    // 창호 구조체
    materials: [
      // 프레임
      {
        id: 'aluminum_frame',
        name: '알루미늄 프레임',
        nameEn: 'Aluminum Frame',
        category: 'frame',
        categoryName: '프레임',
        gwp: 28890,
        unit: 'kg CO2eq/m³',
        density: 2700,
        color: '#95a5a6',
        source: '한국환경산업기술원',
        description: '일반 알루미늄 창호 프레임'
      },
      {
        id: 'aluminum_thermal_frame',
        name: '알루미늄 단열 프레임',
        nameEn: 'Aluminum Thermal Break Frame',
        category: 'frame',
        categoryName: '프레임',
        gwp: 30500,
        unit: 'kg CO2eq/m³',
        density: 2700,
        color: '#636e72',
        source: '한국환경산업기술원',
        description: '단열 브레이크 적용 알루미늄 프레임'
      },
      {
        id: 'pvc_frame',
        name: 'PVC 프레임',
        nameEn: 'PVC Frame',
        category: 'frame',
        categoryName: '프레임',
        gwp: 3100,
        unit: 'kg CO2eq/m³',
        density: 1400,
        color: '#dfe6e9',
        source: '한국환경산업기술원',
        description: 'uPVC 창호 프레임'
      },
      {
        id: 'wood_frame',
        name: '목재 프레임',
        nameEn: 'Wood Frame',
        category: 'frame',
        categoryName: '프레임',
        gwp: -680,
        unit: 'kg CO2eq/m³',
        density: 500,
        color: '#d63031',
        source: '한국환경산업기술원',
        description: '천연 목재 창호 프레임'
      },
      {
        id: 'wood_aluminum_frame',
        name: '목재-알루미늄 복합 프레임',
        nameEn: 'Wood-Aluminum Composite Frame',
        category: 'frame',
        categoryName: '프레임',
        gwp: 8500,
        unit: 'kg CO2eq/m³',
        density: 1200,
        color: '#e17055',
        source: '한국환경산업기술원',
        description: '내부 목재, 외부 알루미늄 복합'
      },
      // 유리
      {
        id: 'single_glass',
        name: '단층 유리 (5mm)',
        nameEn: 'Single Glass 5mm',
        category: 'glass',
        categoryName: '유리',
        gwp: 1520,
        unit: 'kg CO2eq/m³',
        density: 2500,
        color: '#74b9ff',
        source: '한국환경산업기술원',
        description: '일반 판유리'
      },
      {
        id: 'double_glass',
        name: '복층 유리 (5+12+5)',
        nameEn: 'Double Glazing 5+12+5',
        category: 'glass',
        categoryName: '유리',
        gwp: 1680,
        unit: 'kg CO2eq/m³',
        density: 2500,
        color: '#0984e3',
        source: '한국환경산업기술원',
        description: '복층 유리 (공기층 12mm)'
      },
      {
        id: 'triple_glass',
        name: '삼중 유리 (5+12+5+12+5)',
        nameEn: 'Triple Glazing 5+12+5+12+5',
        category: 'glass',
        categoryName: '유리',
        gwp: 1850,
        unit: 'kg CO2eq/m³',
        density: 2500,
        color: '#6c5ce7',
        source: '한국환경산업기술원',
        description: '삼중 유리 (공기층 2개)'
      },
      {
        id: 'low_e_double',
        name: 'Low-E 복층 유리',
        nameEn: 'Low-E Double Glazing',
        category: 'glass',
        categoryName: '유리',
        gwp: 1920,
        unit: 'kg CO2eq/m³',
        density: 2500,
        color: '#00cec9',
        source: '한국환경산업기술원',
        description: '저방사 코팅 복층 유리'
      },
      {
        id: 'low_e_triple',
        name: 'Low-E 삼중 유리',
        nameEn: 'Low-E Triple Glazing',
        category: 'glass',
        categoryName: '유리',
        gwp: 2150,
        unit: 'kg CO2eq/m³',
        density: 2500,
        color: '#00b894',
        source: '한국환경산업기술원',
        description: '저방사 코팅 삼중 유리'
      },
      {
        id: 'tempered_glass',
        name: '강화 유리',
        nameEn: 'Tempered Glass',
        category: 'glass',
        categoryName: '유리',
        gwp: 1750,
        unit: 'kg CO2eq/m³',
        density: 2500,
        color: '#a29bfe',
        source: '한국환경산업기술원',
        description: '열처리 강화 유리'
      },
      {
        id: 'laminated_glass',
        name: '접합 유리',
        nameEn: 'Laminated Glass',
        category: 'glass',
        categoryName: '유리',
        gwp: 1880,
        unit: 'kg CO2eq/m³',
        density: 2500,
        color: '#fdcb6e',
        source: '한국환경산업기술원',
        description: 'PVB 필름 접합 유리'
      }
    ]
  }
};

// 자재 카테고리 정의
const MATERIAL_CATEGORIES = {
  structural: { name: '구조재', color: '#2d3436', icon: '🏗️' },
  insulation: { name: '단열재', color: '#00b894', icon: '🧊' },
  waterproofing: { name: '방수층', color: '#00cec9', icon: '💧' },
  exterior: { name: '외장재', color: '#6c5ce7', icon: '🏢' },
  finishing: { name: '마감재', color: '#fdcb6e', icon: '🎨' }
};

// 환경 영향 카테고리
const IMPACT_CATEGORIES = {
  gwp: {
    name: 'Global Warming Potential',
    nameKo: '지구온난화지수',
    unit: 'kg CO2eq',
    description: '온실가스 배출로 인한 지구 온난화 영향'
  }
  // 추후 ODP, POCP, AP, EP 등 추가 가능
};
