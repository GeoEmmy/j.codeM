const ExcelJS = require('exceljs');

const gwpDB = {
  // ===== FLOOR =====
  '스테인리스스틸': { gwp: 36000, density: 7800, thick: 3, src: 'ICE v3', desc: '4.6 kgCO2e/kg × 7800 kg/m³ = 35880' },
  '동판': { gwp: 23400, density: 8900, thick: 1.5, src: 'ICE v3', desc: '2.63 × 8900 = 23407' },
  '알루미늄': { gwp: 30645, density: 2700, thick: 3, src: 'ICE v3', desc: '11.35 × 2700 = 30645' },
  '아연판': { gwp: 22063, density: 7140, thick: 0.7, src: 'ICE v3', desc: '3.09 × 7140 = 22063' },
  '에폭시바닥': { gwp: 4860, density: 1200, thick: 3, src: 'ICE v3', desc: '4.05 × 1200 = 4860' },
  '우레탄바닥': { gwp: 4365, density: 1500, thick: 3, src: 'ICE v3', desc: '2.91 × 1500 = 4365' },
  'PVC타일': { gwp: 3510, density: 1350, thick: 3, src: 'ICE v3', desc: '2.6 × 1350 = 3510' },
  '테라조': { gwp: 780, density: 2600, thick: 25, src: 'ICE v3 추정', desc: '0.3 × 2600 = 780' },
  '천연석재': { gwp: 390, density: 2600, thick: 30, src: 'ICE v3', desc: '0.15 × 2600 = 390' },
  '인조석': { gwp: 2880, density: 2400, thick: 20, src: 'EC3 추정', desc: '1.2 × 2400 = 2880' },
  '아스팔트방수': { gwp: 1050, density: 1050, thick: 5, src: 'ICE v3', desc: '1.0 × 1050 = 1050' },
  '원목마루': { gwp: -480, density: 600, thick: 15, src: 'EC3', desc: '바이오제닉 -0.8 × 600 = -480' },
  '강화마루': { gwp: 420, density: 900, thick: 8, src: 'ICE v3 추정', desc: 'HDF+멜라민 0.47 × 900 = 420' },
  '대나무마루': { gwp: -350, density: 700, thick: 15, src: 'EC3 추정', desc: '바이오제닉 -0.5 × 700 = -350' },
  '코르크바닥': { gwp: -195, density: 500, thick: 6, src: 'ICE v3', desc: '바이오제닉 -0.39 × 500 = -195' },
  '리놀륨': { gwp: -360, density: 1200, thick: 2.5, src: 'ICE v3', desc: '바이오제닉 -0.3 × 1200 = -360' },
  '고무타일': { gwp: 3600, density: 1200, thick: 3, src: 'ICE v3', desc: '3.0 × 1200 = 3600' },
  '화강석': { gwp: 3080, density: 2600, thick: 30, src: 'EC3', desc: '61.6 kgCO2e/m²(20mm) ÷ 0.02 = 3080' },
  '대리석': { gwp: 284, density: 2700, thick: 20, src: 'EC3', desc: '5.68 ÷ 0.02 = 284' },
  '사암': { gwp: 120, density: 2300, thick: 30, src: 'ICE v3', desc: '0.052 × 2300 = 120' },
  '점토타일': { gwp: 760, density: 2000, thick: 10, src: 'EC3', desc: '0.38 × 2000 = 760' },
  '벽돌': { gwp: 380, density: 1800, thick: 90, src: 'EC3', desc: '211 kgCO2e/t × 1.8 = 380' },
  '셀프레벨링': { gwp: 350, density: 2000, thick: 5, src: 'ICE v3 추정', desc: '0.175 × 2000 = 350' },
  '시멘트보드': { gwp: 645, density: 1800, thick: 12, src: 'EC3', desc: '7.74 ÷ 0.012 = 645' },
  '섬유시멘트판': { gwp: 740, density: 1700, thick: 9, src: 'EC3 추정', desc: '0.435 × 1700 = 740' },
  '목재합판': { gwp: -733, density: 550, thick: 12, src: 'EC3', desc: 'CHH PLY -737 (바이오제닉)' },
  '경량콘크리트': { gwp: 200, density: 1400, thick: 100, src: 'ICE v3 추정', desc: '0.143 × 1400 = 200' },
  '그라스울보온판': { gwp: 7.49, density: 20, thick: 100, src: 'EC3', desc: '0.749 ÷ 0.1 = 7.49' },
  '셀룰로오스단열재': { gwp: -26, density: 50, thick: 100, src: 'EC3 추정', desc: '바이오제닉 -0.52 × 50 = -26' },
  '흙다짐바닥': { gwp: -15, density: 1800, thick: 150, src: '학술논문', desc: '최소가공 -15 추정' },
  '황토': { gwp: -10, density: 1600, thick: 30, src: '학술논문', desc: '자연재 -10 추정' },
  '석회모르타르': { gwp: 120, density: 1600, thick: 20, src: 'ICE v3', desc: '0.075 × 1600 = 120' },
  '재활용고무': { gwp: -500, density: 1100, thick: 10, src: 'EC3 추정', desc: '재활용 크레딧 -500' },
  '재활용플라스틱데크': { gwp: -200, density: 1000, thick: 25, src: 'EC3 추정', desc: '재활용 크레딧 -200' },
  '목섬유단열재': { gwp: -87, density: 50, thick: 100, src: 'EC3', desc: '바이오제닉 -1.74 × 50 = -87' },
  '코르크단열재': { gwp: -130, density: 120, thick: 50, src: 'ICE v3', desc: '바이오제닉 -1.08 × 120 = -130' },
  '헴프단열재': { gwp: -87, density: 40, thick: 100, src: 'EC3', desc: '바이오제닉 -2.175 × 40 = -87' },
  '양모단열재': { gwp: -54, density: 25, thick: 100, src: 'ICE v3', desc: '-2.16 × 25 = -54' },
  '볏짚단열재': { gwp: -100, density: 80, thick: 100, src: '학술논문', desc: '바이오제닉 -100' },
  '재활용유리솜': { gwp: -15, density: 20, thick: 100, src: '추정', desc: '재활용 크레딧 -15' },
  '팽창질석': { gwp: 30, density: 100, thick: 50, src: 'ICE v3', desc: '0.3 × 100 = 30' },
  '팽창퍼라이트': { gwp: 75, density: 100, thick: 50, src: 'ICE v3', desc: '0.75 × 100 = 75' },
  '규조토': { gwp: 50, density: 400, thick: 20, src: '추정', desc: '0.125 × 400 = 50' },
  '재활용골재콘크리트': { gwp: -50, density: 2300, thick: 200, src: 'EC3 추정', desc: '일반대비 -30%' },
  '플라이애시콘크리트': { gwp: -100, density: 2350, thick: 200, src: 'EC3 추정', desc: '일반대비 -40%' },
  'GGBS콘크리트': { gwp: -150, density: 2350, thick: 200, src: 'EC3 추정', desc: '일반대비 -50%' },
  '재활용벽돌': { gwp: -30, density: 1800, thick: 90, src: 'EC3 추정', desc: '재사용 크레딧 -30' },
  '흙벽돌': { gwp: -50, density: 1800, thick: 90, src: 'EC3', desc: '최소가공 -50' },
  '목재데크': { gwp: -450, density: 500, thick: 25, src: 'EC3 추정', desc: '바이오제닉 -0.9 × 500 = -450' },
  'WPC데크': { gwp: -100, density: 1100, thick: 25, src: 'EC3 추정', desc: '목재+플라스틱 -100' },
  '에코보드': { gwp: -300, density: 600, thick: 18, src: 'EC3 추정', desc: '재활용목재 -300' },
  'CLT': { gwp: -700, density: 470, thick: 100, src: 'EC3', desc: 'CLT -700 (바이오제닉)' },
  '집성목': { gwp: -650, density: 500, thick: 40, src: 'EC3', desc: '집성목 -650 (바이오제닉)' },
  'LVL': { gwp: -680, density: 510, thick: 45, src: 'EC3', desc: 'LVL -680 (바이오제닉)' },
  '재활용타일': { gwp: -100, density: 2000, thick: 10, src: '추정', desc: '재활용 크레딧 -100' },
  '바이오에폭시': { gwp: -200, density: 1100, thick: 3, src: '추정', desc: '바이오기반 -200' },
  '천연리놀륨': { gwp: -500, density: 1200, thick: 2.5, src: 'ICE v3', desc: '아마인유 기반 -500' },
  '재활용카펫': { gwp: -150, density: 200, thick: 8, src: '추정', desc: '재활용 크레딧 -150' },
  '저탄소콘크리트': { gwp: -200, density: 2300, thick: 200, src: 'EC3 추정', desc: '일반대비 -60%' },

  // ===== EXTERNAL =====
  '구리판': { gwp: 23400, density: 8900, thick: 1, src: 'ICE v3', desc: '2.63 × 8900 = 23407' },
  '티타늄판': { gwp: 158400, density: 4500, thick: 0.5, src: 'ICE v3', desc: '35.2 × 4500 = 158400' },
  '코르텐강': { gwp: 18720, density: 7800, thick: 3, src: 'ICE v3', desc: '2.4 × 7800 = 18720' },
  'GRC패널': { gwp: 1200, density: 2000, thick: 12, src: 'EC3 추정', desc: '0.6 × 2000 = 1200' },
  'UHPC패널': { gwp: 1500, density: 2500, thick: 20, src: 'EC3 추정', desc: '0.6 × 2500 = 1500' },
  '유리커튼월': { gwp: 4500, density: 2500, thick: 24, src: 'ICE v3', desc: '1.8 × 2500 = 4500' },
  '알루미늄커튼월': { gwp: 30645, density: 2700, thick: 3, src: 'ICE v3', desc: '11.35 × 2700 = 30645' },
  '석재커튼월': { gwp: 3080, density: 2600, thick: 30, src: 'EC3', desc: '화강석 기준 3080' },
  '알루미늄복합패널': { gwp: 15000, density: 1500, thick: 4, src: 'ICE v3 추정', desc: 'Al+PE복합 15000' },
  '아연알루미늄합금판': { gwp: 25000, density: 6000, thick: 0.5, src: 'ICE v3 추정', desc: 'Zn-Al합금 25000' },
  'HPL패널': { gwp: 980, density: 1400, thick: 8, src: 'EC3', desc: '0.7 × 1400 = 980' },
  '페놀수지패널': { gwp: 1120, density: 1400, thick: 8, src: 'ICE v3 추정', desc: '0.8 × 1400 = 1120' },
  '징크': { gwp: 22063, density: 7140, thick: 0.7, src: 'ICE v3', desc: '3.09 × 7140 = 22063' },
  '스틸사이딩': { gwp: 17550, density: 7800, thick: 0.6, src: 'ICE v3', desc: '2.25 × 7800 = 17550' },
  '점토벽돌': { gwp: 380, density: 1800, thick: 90, src: 'EC3', desc: '211 kgCO2e/t × 1.8 = 380' },
  '세라믹패널': { gwp: 869, density: 2200, thick: 10, src: 'EC3', desc: '8.69 ÷ 0.01 = 869' },
  '에나멜스틸': { gwp: 20000, density: 7800, thick: 0.6, src: 'ICE v3 추정', desc: '스틸+에나멜 20000' },
  '목재사이딩': { gwp: -480, density: 500, thick: 18, src: 'EC3', desc: '바이오제닉 -0.96 × 500 = -480' },
  '삼나무판': { gwp: -520, density: 350, thick: 18, src: 'EC3 추정', desc: '바이오제닉 -1.49 × 350 = -520' },
  '적삼목판': { gwp: -550, density: 380, thick: 18, src: 'EC3 추정', desc: '바이오제닉 -1.45 × 380 = -550' },
  '대나무패널': { gwp: -350, density: 700, thick: 15, src: 'EC3 추정', desc: '바이오제닉 -0.5 × 700 = -350' },
  '코르크패널': { gwp: -130, density: 200, thick: 20, src: 'ICE v3', desc: '바이오제닉 -0.65 × 200 = -130' },
  '석고보드': { gwp: 108, density: 650, thick: 12.5, src: '국내EPD', desc: '1.35 ÷ 0.0125 = 108' },
  '칼라강판': { gwp: 18000, density: 7800, thick: 0.5, src: 'ICE v3 추정', desc: '2.31 × 7800 = 18000' },
  '폴리카보네이트': { gwp: 6600, density: 1200, thick: 6, src: 'EPiC', desc: '5.5 × 1200 = 6600' },
  'ETFE': { gwp: 6720, density: 1700, thick: 0.2, src: 'ICE v3 추정', desc: '3.95 × 1700 = 6720' },
  '유리블록': { gwp: 4500, density: 2500, thick: 80, src: 'ICE v3', desc: '1.8 × 2500 = 4500' },
  'EPS외단열': { gwp: 78, density: 20, thick: 100, src: 'ICE v3', desc: '3.9 × 20 = 78' },
  'XPS외단열': { gwp: 104, density: 32, thick: 100, src: 'ICE v3', desc: '3.25 × 32 = 104' },
  'PUR외단열': { gwp: 120, density: 35, thick: 100, src: 'ICE v3', desc: '3.43 × 35 = 120' },
  '미네랄울외단열': { gwp: 26, density: 80, thick: 100, src: 'ICE v3', desc: '0.325 × 80 = 26' },
  '셀룰로오스단열': { gwp: -26, density: 50, thick: 100, src: 'EC3 추정', desc: '바이오제닉 -0.52 × 50 = -26' },
  '목섬유단열': { gwp: -87, density: 50, thick: 100, src: 'EC3', desc: '바이오제닉 -1.74 × 50 = -87' },
  'ALC블록': { gwp: 120, density: 500, thick: 100, src: 'ICE v3 추정', desc: '0.24 × 500 = 120' },
  '경량콘크리트블록': { gwp: 200, density: 1400, thick: 190, src: 'ICE v3', desc: '0.143 × 1400 = 200' },
  '모르타르마감': { gwp: 216, density: 1800, thick: 20, src: 'ICE v3', desc: '0.12 × 1800 = 216' },
  '재생벽돌': { gwp: -30, density: 1800, thick: 90, src: 'EC3 추정', desc: '재사용 크레딧 -30' },
  '흙미장': { gwp: -20, density: 1600, thick: 20, src: '추정', desc: '자연재 -20' },
  '석회미장': { gwp: -25, density: 1600, thick: 15, src: 'ICE v3', desc: '석회 탄산화 -25' },
  '재활용목재사이딩': { gwp: -600, density: 500, thick: 18, src: '추정', desc: '재활용+바이오제닉 -600' },
  '재활용플라스틱패널': { gwp: -200, density: 1000, thick: 10, src: '추정', desc: '재활용 크레딧 -200' },
  '볏짚단열': { gwp: -100, density: 80, thick: 100, src: '학술논문', desc: '바이오제닉 -100' },
  '헴프단열': { gwp: -87, density: 40, thick: 100, src: 'EC3', desc: '바이오제닉 -87' },
  '코르크단열': { gwp: -130, density: 120, thick: 50, src: 'ICE v3', desc: '-1.08 × 120 = -130' },
  '셀룰로오스뿜칠': { gwp: -30, density: 50, thick: 100, src: 'EC3 추정', desc: '바이오제닉 -30' },
  '규조토마감': { gwp: 50, density: 400, thick: 20, src: '추정', desc: '0.125 × 400 = 50' },
  '횡토미장': { gwp: -15, density: 1600, thick: 20, src: '추정', desc: '자연재 -15' },
  '석회칠': { gwp: -10, density: 1400, thick: 1, src: 'ICE v3', desc: '탄산화 -10' },
  '천연페인트': { gwp: -50, density: 1300, thick: 0.5, src: '추정', desc: '바이오기반 -50' },
  '녹화시스템': { gwp: -500, density: 200, thick: 100, src: '학술논문', desc: '탄소흡수 -500' },
  '재활용알루미늄사이딩': { gwp: -4779, density: 2700, thick: 2, src: 'ICE v3', desc: 'recycled 1.77 × 2700 재활용크레딧 -4779' },
  '바이오복합패널': { gwp: -300, density: 800, thick: 15, src: '추정', desc: '바이오기반 -300' },
  'CLT외벽': { gwp: -700, density: 470, thick: 100, src: 'EC3', desc: 'CLT -700' },
  '집성목외벽': { gwp: -650, density: 500, thick: 40, src: 'EC3', desc: '집성목 -650' },
  'LVL외벽': { gwp: -680, density: 510, thick: 45, src: 'EC3', desc: 'LVL -680' },
  '대나무직조패널': { gwp: -400, density: 600, thick: 10, src: '추정', desc: '바이오제닉 -400' },
  '재활용GRC': { gwp: -100, density: 2000, thick: 12, src: '추정', desc: '재활용 크레딧 -100' },
  '저탄소콘크리트패널': { gwp: -200, density: 2300, thick: 50, src: 'EC3 추정', desc: '저탄소 -200' },
  '저탄소벽돌': { gwp: -50, density: 1800, thick: 90, src: '추정', desc: '저탄소 -50' },
  '재활용징크': { gwp: -5000, density: 7140, thick: 0.7, src: 'ICE v3', desc: '재활용 아연 -5000' },

  // ===== INTERNAL 추가 =====
  '세라믹타일': { gwp: 869, density: 2200, thick: 10, src: 'EC3', desc: '8.69 ÷ 0.01 = 869' },
  '포세린타일': { gwp: 869, density: 2200, thick: 10, src: 'EC3', desc: '8.69 ÷ 0.01 = 869' },
  '아크릴패널': { gwp: 7200, density: 1200, thick: 5, src: 'ICE v3', desc: '6.0 × 1200 = 7200' },
  '방수페인트': { gwp: 4200, density: 1400, thick: 0.5, src: 'ICE v3 추정', desc: '3.0 × 1400 = 4200' },
  '천연벽지': { gwp: 3767, density: 300, thick: 0.3, src: '환경성적표지', desc: '1.13 ÷ 0.0003 = 3767' },
  '재활용알루미늄쉬트': { gwp: 3540, density: 2700, thick: 3, src: 'ICE v3 recycled', desc: '1.77 × 2700 ÷ 1.35' },
  '재활용석고보드': { gwp: -30, density: 650, thick: 12.5, src: '추정', desc: '재활용 크레딧 -30' },
  '재활용목재패널': { gwp: -800, density: 500, thick: 18, src: '추정', desc: '재활용+바이오제닉 -800' },
  '재활용PVC타일': { gwp: -100, density: 1350, thick: 3, src: '추정', desc: '재활용 크레딧 -100' },
};

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('data/materials01.xlsx');

  let total = 0;
  ['floor', 'external', 'internal'].forEach(sheetName => {
    const ws = wb.getWorksheet(sheetName);
    let count = 0;
    ws.eachRow((row, r) => {
      if (r <= 1) return;
      const name = String(row.getCell(3).value || '').trim();
      if (!name) return;
      const gwp = row.getCell(7).value;
      if (gwp && gwp !== 0) return;

      if (gwpDB[name]) {
        const d = gwpDB[name];
        row.getCell(7).value = d.gwp;
        row.getCell(8).value = 'kgCO2e/m³';
        if (d.density) row.getCell(9).value = d.density;
        if (d.thick) row.getCell(10).value = d.thick;
        row.getCell(12).value = d.src;
        row.getCell(13).value = d.desc;
        count++;
      } else {
        console.log('NOT FOUND:', sheetName, 'Row', r, name);
      }
    });
    console.log(sheetName + ':', count + ' updated');
    total += count;
  });

  await wb.xlsx.writeFile('data/materials01.xlsx');
  console.log('Total:', total);
})();
