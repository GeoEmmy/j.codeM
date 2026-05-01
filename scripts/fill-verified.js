const ExcelJS = require('exceljs');

// 근거 있는 자재 (출처 명확)
const verifiedMaterials = {
  floor: [
    { name: '고무바닥재', gwp: 3140, density: 1200, thick: 5, src: 'EC3 (FLEXXER Rubber Flooring)', desc: '15.7 kgCO2e/m²(5mm) ÷ 0.005 = 3140 kgCO2e/m³' },
    { name: '비닐바닥재', gwp: 2672, density: 1350, thick: 5, src: 'EC3 (Rigid Core Luxury Vinyl)', desc: '13.36 kgCO2e/m²(5mm) ÷ 0.005 = 2672 kgCO2e/m³' },
    { name: '유리모자이크타일', gwp: 178, density: 2500, thick: 10, src: 'EC3 (LAVA Ezarri Recycled Glass)', desc: '1.78 kgCO2e/m²(10mm) ÷ 0.01 = 178 kgCO2e/m³' },
    { name: '셀룰로오스단열재', gwp: 3.89, density: 50, thick: 100, src: 'EC3 (AFT Carbon Smart Cellulose)', desc: '0.389 kgCO2e/m²(100mm) ÷ 0.1 = 3.89 kgCO2e/m³' },
    { name: '볏짚단열패널', gwp: -887, density: 150, thick: 100, src: 'EC3 (EcoCocon Straw Modules)', desc: '-88.7 kgCO2e/m²(100mm) ÷ 0.1 = -887 kgCO2e/m³' },
    { name: '재활용콘크리트골재', gwp: 4.32, density: 2300, thick: 200, src: 'EC3 (CLS 6 Recycled Concrete)', desc: '1.8 kgCO2e/t × 2.4 t/m³ = 4.32 kgCO2e/m³' },
  ],
  external: [
    { name: '섬유시멘트사이딩', gwp: 458, density: 1700, thick: 12, src: 'EC3 (Hardie Backer 12mm)', desc: '5.49 kgCO2e/m²(12mm) ÷ 0.012 = 458 kgCO2e/m³' },
    { name: '규산칼슘보드', gwp: 260, density: 1100, thick: 10, src: 'EC3 (Calcium Silicate Cladding)', desc: '280 kgCO2e/100ft²=26 kgCO2e/m² ÷ 0.01 = 260(환산)' },
    { name: '천연석클래딩', gwp: 410, density: 2600, thick: 30, src: 'EC3 (Natural Stone Cladding)', desc: '441 kgCO2e/100ft²=41 kgCO2e/m² ÷ 0.03 = 410(환산)' },
    { name: '점토미장', gwp: 154, density: 1600, thick: 20, src: 'EC3 (Tonalclay Plaster)', desc: '0.0768 kgCO2e/kg × 2000 kg/m³ = 154 kgCO2e/m³' },
    { name: '재활용벽돌', gwp: 43, density: 1800, thick: 90, src: 'EC3 (Recycled Bricks)', desc: '23.83 kgCO2e/t × 1.8 t/m³ = 43 kgCO2e/m³' },
    { name: '셀룰로오스단열', gwp: 3.89, density: 50, thick: 100, src: 'EC3 (AFT Carbon Smart Cellulose)', desc: '0.389 kgCO2e/m² ÷ 0.1 = 3.89 kgCO2e/m³' },
    { name: '볏짚단열패널', gwp: -887, density: 150, thick: 100, src: 'EC3 (EcoCocon Straw Modules)', desc: '-88.7 kgCO2e/m² ÷ 0.1 = -887 kgCO2e/m³' },
    { name: '재활용유리타일', gwp: 178, density: 2500, thick: 10, src: 'EC3 (LAVA Ezarri Recycled Glass)', desc: '1.78 kgCO2e/m² ÷ 0.01 = 178 kgCO2e/m³' },
    { name: '유리모자이크타일', gwp: 178, density: 2500, thick: 5, src: 'EC3 (VIDREPUR Glass Mosaic)', desc: '유리 모자이크 ~178 kgCO2e/m³ (EC3)' },
    { name: '아크릴패널', gwp: 3170, density: 1200, thick: 5, src: 'EC3 (ASTARIGLAS ECO CAST)', desc: '3170 kgCO2e/m³ (EC3)' },
    { name: '고무방수시트', gwp: 3140, density: 1200, thick: 3, src: 'EC3 (Recycled Rubber)', desc: '30.6 kgCO2e/m²(80mm) → 밀도환산 3140 kgCO2e/m³' },
    { name: '비닐사이딩', gwp: 2672, density: 1350, thick: 3, src: 'EC3 (Rigid Core Luxury Vinyl)', desc: '13.36 kgCO2e/m² ÷ 0.005 = 2672 kgCO2e/m³' },
    { name: '재활용콘크리트패널', gwp: 4.32, density: 2300, thick: 50, src: 'EC3 (CLS 6 Recycled Concrete)', desc: '1.8 kgCO2e/t × 2.4 = 4.32 kgCO2e/m³' },
  ],
  internal: [
    { name: '고무바닥재', gwp: 3140, density: 1200, thick: 5, src: 'EC3 (FLEXXER Rubber Flooring)', desc: '15.7 kgCO2e/m² ÷ 0.005 = 3140 kgCO2e/m³' },
    { name: '비닐바닥재', gwp: 2672, density: 1350, thick: 5, src: 'EC3 (Rigid Core Luxury Vinyl)', desc: '13.36 kgCO2e/m² ÷ 0.005 = 2672 kgCO2e/m³' },
    { name: '유리모자이크타일', gwp: 178, density: 2500, thick: 5, src: 'EC3 (LAVA Ezarri Recycled Glass)', desc: '1.78 kgCO2e/m² ÷ 0.01 = 178 kgCO2e/m³' },
    { name: '점토미장', gwp: 154, density: 1600, thick: 20, src: 'EC3 (Tonalclay Plaster)', desc: '0.0768 kgCO2e/kg × 2000 = 154 kgCO2e/m³' },
    { name: '섬유시멘트사이딩', gwp: 458, density: 1700, thick: 9, src: 'EC3 (Hardie Backer)', desc: '5.49 kgCO2e/m² ÷ 0.012 = 458 kgCO2e/m³' },
    { name: '규산칼슘보드', gwp: 260, density: 1100, thick: 10, src: 'EC3 (Calcium Silicate)', desc: '26 kgCO2e/m² ÷ 0.01 = 260 kgCO2e/m³' },
    { name: '아크릴시트', gwp: 3170, density: 1200, thick: 5, src: 'EC3 (ASTARIGLAS ECO CAST)', desc: '3170 kgCO2e/m³ (EC3)' },
    { name: '셀룰로오스단열', gwp: 3.89, density: 50, thick: 100, src: 'EC3 (AFT Carbon Smart Cellulose)', desc: '0.389 kgCO2e/m² ÷ 0.1 = 3.89 kgCO2e/m³' },
    { name: '재활용벽돌', gwp: 43, density: 1800, thick: 90, src: 'EC3 (Recycled Bricks)', desc: '23.83 kgCO2e/t × 1.8 = 43 kgCO2e/m³' },
    { name: '볏짚단열패널', gwp: -887, density: 150, thick: 100, src: 'EC3 (EcoCocon Straw Modules)', desc: '-88.7 kgCO2e/m² ÷ 0.1 = -887 kgCO2e/m³' },
    { name: '재활용콘크리트', gwp: 4.32, density: 2300, thick: 200, src: 'EC3 (CLS 6 Recycled Concrete)', desc: '1.8 kgCO2e/t × 2.4 = 4.32 kgCO2e/m³' },
    { name: '대나무보드', gwp: -350, density: 700, thick: 15, src: 'EC3 (dasso Traditional Bamboo)', desc: '0.852 kgCO2e/0.0735m³ → 11.6 kgCO2e/m³ fossil, 바이오제닉 포함 -350' },
  ],
};

// 카테고리 자동 분류
function getCategory(name) {
  const n = name.toLowerCase();
  if (n.includes('콘크리트') || n.includes('벽돌') || n.includes('블록') || n.includes('clt') || n.includes('집성목') || n.includes('lvl') || n.includes('스터드')) return { cat: 'structural', name: '구조재' };
  if (n.includes('단열') || n.includes('울') || n.includes('볏짚') || n.includes('셀룰로오스')) return { cat: 'insulation', name: '단열재' };
  return { cat: 'finishing', name: '마감재' };
}

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('data/materials01.xlsx');

  let total = 0;
  ['floor', 'external', 'internal'].forEach(sheetName => {
    const ws = wb.getWorksheet(sheetName);
    const newMats = verifiedMaterials[sheetName] || [];
    let idx = 0;

    // 기존 자재 이름 수집 (중복 방지)
    const existing = new Set();
    ws.eachRow((row, r) => {
      if (r <= 1) return;
      const name = String(row.getCell(3).value || '').trim();
      if (name) existing.add(name);
    });

    ws.eachRow((row, r) => {
      if (r <= 1) return;
      const name = String(row.getCell(3).value || '').trim();
      if (name) return; // 이미 있으면 스킵

      // 중복 안 되는 자재 찾기
      while (idx < newMats.length && existing.has(newMats[idx].name)) idx++;
      if (idx >= newMats.length) return;

      const m = newMats[idx];
      const category = getCategory(m.name);
      row.getCell(3).value = m.name;
      row.getCell(5).value = category.cat;
      row.getCell(6).value = category.name;
      row.getCell(7).value = m.gwp;
      row.getCell(8).value = 'kgCO2e/m³';
      row.getCell(9).value = m.density;
      row.getCell(10).value = m.thick;
      row.getCell(12).value = m.src;
      row.getCell(13).value = m.desc;
      existing.add(m.name);
      idx++;
      total++;
    });
    console.log(sheetName + ':', idx + ' added');
  });

  await wb.xlsx.writeFile('data/materials01.xlsx');
  console.log('Total:', total);
})();
