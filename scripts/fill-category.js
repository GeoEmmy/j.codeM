const ExcelJS = require('exceljs');

// 자재명 → { category, categoryName } 매핑
const categoryMap = {
  // 구조재
  '구조용강재': { cat: 'structural', name: '구조재' },
  '강관': { cat: 'structural', name: '구조재' },
  '스틸스터드': { cat: 'structural', name: '구조재' },
  '목재스터드': { cat: 'structural', name: '구조재' },
  '콘크리트': { cat: 'structural', name: '구조재' },
  '콘크리트벽돌': { cat: 'structural', name: '구조재' },
  '콘크리트블럭': { cat: 'structural', name: '구조재' },
  '경량콘크리트': { cat: 'structural', name: '구조재' },
  '경량기포콘크리트': { cat: 'structural', name: '구조재' },
  '경량콘크리트블록': { cat: 'structural', name: '구조재' },
  'ALC블록': { cat: 'structural', name: '구조재' },
  'CLT': { cat: 'structural', name: '구조재' },
  'CLT외벽': { cat: 'structural', name: '구조재' },
  '집성목': { cat: 'structural', name: '구조재' },
  '집성목외벽': { cat: 'structural', name: '구조재' },
  'LVL': { cat: 'structural', name: '구조재' },
  'LVL외벽': { cat: 'structural', name: '구조재' },
  '벽돌': { cat: 'structural', name: '구조재' },
  '점토벽돌': { cat: 'structural', name: '구조재' },
  '재사용벽돌': { cat: 'structural', name: '구조재' },
  '재활용벽돌': { cat: 'structural', name: '구조재' },
  '재생벽돌': { cat: 'structural', name: '구조재' },
  '흙벽돌': { cat: 'structural', name: '구조재' },
  '저탄소벽돌': { cat: 'structural', name: '구조재' },
  '바이오차벽돌': { cat: 'structural', name: '구조재' },
  '저탄소콘크리트': { cat: 'structural', name: '구조재' },
  '재활용골재콘크리트': { cat: 'structural', name: '구조재' },
  '플라이애시콘크리트': { cat: 'structural', name: '구조재' },
  'GGBS콘크리트': { cat: 'structural', name: '구조재' },
  '재활용콘크리트': { cat: 'structural', name: '구조재' },
  '바이오차콘크리트': { cat: 'structural', name: '구조재' },
  '저탄소콘크리트패널': { cat: 'structural', name: '구조재' },
  '헴프크리트': { cat: 'structural', name: '구조재' },
  '헴프크리트울': { cat: 'structural', name: '구조재' },
  '짚벽': { cat: 'structural', name: '구조재' },
  'UHPC패널': { cat: 'structural', name: '구조재' },
  'GRC패널': { cat: 'structural', name: '구조재' },
  '재활용GRC': { cat: 'structural', name: '구조재' },
  '유리블록': { cat: 'structural', name: '구조재' },

  // 단열재
  'XPS(골드폼)': { cat: 'insulation', name: '단열재' },
  'EPS(네오보드)': { cat: 'insulation', name: '단열재' },
  '글라스울 24K': { cat: 'insulation', name: '단열재' },
  '글라스울': { cat: 'insulation', name: '단열재' },
  '그라스울': { cat: 'insulation', name: '단열재' },
  '그라스울보온판': { cat: 'insulation', name: '단열재' },
  '암면': { cat: 'insulation', name: '단열재' },
  '진공단열재': { cat: 'insulation', name: '단열재' },
  'SNC보드': { cat: 'insulation', name: '단열재' },
  '에어론단열재': { cat: 'insulation', name: '단열재' },
  'PUR단열재': { cat: 'insulation', name: '단열재' },
  'PIR': { cat: 'insulation', name: '단열재' },
  '셀룰로오스단열재': { cat: 'insulation', name: '단열재' },
  '셀룰로오스단열': { cat: 'insulation', name: '단열재' },
  '셀룰로오스뿜칠': { cat: 'insulation', name: '단열재' },
  '목섬유단열재': { cat: 'insulation', name: '단열재' },
  '목섬유단열': { cat: 'insulation', name: '단열재' },
  '코르크단열재': { cat: 'insulation', name: '단열재' },
  '코르크단열': { cat: 'insulation', name: '단열재' },
  '헴프단열재': { cat: 'insulation', name: '단열재' },
  '헴프단열': { cat: 'insulation', name: '단열재' },
  '양모단열재': { cat: 'insulation', name: '단열재' },
  '볏짚단열재': { cat: 'insulation', name: '단열재' },
  '볏짚단열': { cat: 'insulation', name: '단열재' },
  '재활용유리솜': { cat: 'insulation', name: '단열재' },
  '팽창질석': { cat: 'insulation', name: '단열재' },
  '팽창퍼라이트': { cat: 'insulation', name: '단열재' },
  '폴리우레탄흡음재': { cat: 'insulation', name: '단열재' },
  'EPS외단열': { cat: 'insulation', name: '단열재' },
  'XPS외단열': { cat: 'insulation', name: '단열재' },
  'PUR외단열': { cat: 'insulation', name: '단열재' },
  '미네랄울외단열': { cat: 'insulation', name: '단열재' },

  // 방수재
  '아스팔트방수': { cat: 'waterproof', name: '방수재' },
  '방수페인트': { cat: 'waterproof', name: '방수재' },

  // 마감재 - 금속
  '스테인리스스틸': { cat: 'finishing', name: '마감재' },
  '동판': { cat: 'finishing', name: '마감재' },
  '알루미늄': { cat: 'finishing', name: '마감재' },
  '알루미늄판': { cat: 'finishing', name: '마감재' },
  '알루미늄쉬트': { cat: 'finishing', name: '마감재' },
  '재활용알루미늄쉬트': { cat: 'finishing', name: '마감재' },
  '재생알루미늄': { cat: 'finishing', name: '마감재' },
  '아연판': { cat: 'finishing', name: '마감재' },
  '아연': { cat: 'finishing', name: '마감재' },
  '용융아연도금철판': { cat: 'finishing', name: '마감재' },
  '구리판': { cat: 'finishing', name: '마감재' },
  '티타늄판': { cat: 'finishing', name: '마감재' },
  '코르텐강': { cat: 'finishing', name: '마감재' },
  '징크': { cat: 'finishing', name: '마감재' },
  '재활용징크': { cat: 'finishing', name: '마감재' },
  '칼라강판': { cat: 'finishing', name: '마감재' },
  '스틸사이딩': { cat: 'finishing', name: '마감재' },
  '에나멜스틸': { cat: 'finishing', name: '마감재' },
  '알루미늄커튼월': { cat: 'finishing', name: '마감재' },
  '알루미늄복합패널': { cat: 'finishing', name: '마감재' },
  '아연알루미늄합금판': { cat: 'finishing', name: '마감재' },
  '재활용알루미늄사이딩': { cat: 'finishing', name: '마감재' },

  // 마감재 - 석재/타일
  '화강석': { cat: 'finishing', name: '마감재' },
  '화강암': { cat: 'finishing', name: '마감재' },
  '대리석': { cat: 'finishing', name: '마감재' },
  '사암': { cat: 'finishing', name: '마감재' },
  '라임스톤': { cat: 'finishing', name: '마감재' },
  '석회암': { cat: 'finishing', name: '마감재' },
  '천연석재': { cat: 'finishing', name: '마감재' },
  '인조석': { cat: 'finishing', name: '마감재' },
  '테라조': { cat: 'finishing', name: '마감재' },
  '포세린타일': { cat: 'finishing', name: '마감재' },
  '세라믹타일': { cat: 'finishing', name: '마감재' },
  '도기질타일': { cat: 'finishing', name: '마감재' },
  '점토타일': { cat: 'finishing', name: '마감재' },
  '재활용타일': { cat: 'finishing', name: '마감재' },
  '석재커튼월': { cat: 'finishing', name: '마감재' },
  '유리커튼월': { cat: 'finishing', name: '마감재' },

  // 마감재 - 바닥
  '에폭시바닥': { cat: 'finishing', name: '마감재' },
  '우레탄바닥': { cat: 'finishing', name: '마감재' },
  'PVC타일': { cat: 'finishing', name: '마감재' },
  '재활용PVC타일': { cat: 'finishing', name: '마감재' },
  '카펫': { cat: 'finishing', name: '마감재' },
  '재활용카펫': { cat: 'finishing', name: '마감재' },
  '고무타일': { cat: 'finishing', name: '마감재' },
  '재활용고무': { cat: 'finishing', name: '마감재' },
  '재활용고무타일': { cat: 'finishing', name: '마감재' },
  'OA타일': { cat: 'finishing', name: '마감재' },
  '골드타일': { cat: 'finishing', name: '마감재' },
  '센스타일': { cat: 'finishing', name: '마감재' },
  'VIP타일': { cat: 'finishing', name: '마감재' },
  '디럭스타일': { cat: 'finishing', name: '마감재' },
  '원목마루': { cat: 'finishing', name: '마감재' },
  '강화마루': { cat: 'finishing', name: '마감재' },
  '대나무마루': { cat: 'finishing', name: '마감재' },
  '코르크바닥': { cat: 'finishing', name: '마감재' },
  '리놀륨': { cat: 'finishing', name: '마감재' },
  '천연리놀륨': { cat: 'finishing', name: '마감재' },
  '바이오에폭시': { cat: 'finishing', name: '마감재' },
  '셀프레벨링': { cat: 'finishing', name: '마감재' },
  '흙다짐바닥': { cat: 'finishing', name: '마감재' },

  // 마감재 - 벽/패널
  '페인트': { cat: 'finishing', name: '마감재' },
  '천연페인트': { cat: 'finishing', name: '마감재' },
  '벽지': { cat: 'finishing', name: '마감재' },
  '벽지(LX)': { cat: 'finishing', name: '마감재' },
  '천연벽지': { cat: 'finishing', name: '마감재' },
  '석고보드': { cat: 'finishing', name: '마감재' },
  '재활용석고보드': { cat: 'finishing', name: '마감재' },
  '석고미장': { cat: 'finishing', name: '마감재' },
  '시멘트미장': { cat: 'finishing', name: '마감재' },
  '시멘트모르타르': { cat: 'finishing', name: '마감재' },
  '석회모르타르': { cat: 'finishing', name: '마감재' },
  '모르타르마감': { cat: 'finishing', name: '마감재' },
  '석회미장': { cat: 'finishing', name: '마감재' },
  '석회칠': { cat: 'finishing', name: '마감재' },
  '흙미장': { cat: 'finishing', name: '마감재' },
  '횡토미장': { cat: 'finishing', name: '마감재' },
  '황토': { cat: 'finishing', name: '마감재' },
  '규조토': { cat: 'finishing', name: '마감재' },
  '규조토마감': { cat: 'finishing', name: '마감재' },
  '시멘트판넬': { cat: 'finishing', name: '마감재' },
  '시멘트보드': { cat: 'finishing', name: '마감재' },
  '섬유시멘트판': { cat: 'finishing', name: '마감재' },
  '섬유시멘트': { cat: 'finishing', name: '마감재' },
  '재활용섬유시멘트': { cat: 'finishing', name: '마감재' },
  'HPL패널': { cat: 'finishing', name: '마감재' },
  '페놀수지패널': { cat: 'finishing', name: '마감재' },
  '세라믹패널': { cat: 'finishing', name: '마감재' },
  '테라코타': { cat: 'finishing', name: '마감재' },
  '폴리카보네이트': { cat: 'finishing', name: '마감재' },
  'ETFE': { cat: 'finishing', name: '마감재' },
  '아크릴패널': { cat: 'finishing', name: '마감재' },
  '흡음패널': { cat: 'finishing', name: '마감재' },

  // 마감재 - 목재
  'MDF': { cat: 'finishing', name: '마감재' },
  'OSB': { cat: 'finishing', name: '마감재' },
  '합판': { cat: 'finishing', name: '마감재' },
  '목재합판': { cat: 'finishing', name: '마감재' },
  '파티클보드': { cat: 'finishing', name: '마감재' },
  '목재패널': { cat: 'finishing', name: '마감재' },
  '재활용목재패널': { cat: 'finishing', name: '마감재' },
  '목모보드': { cat: 'finishing', name: '마감재' },
  '에코보드': { cat: 'finishing', name: '마감재' },
  '목재사이딩': { cat: 'finishing', name: '마감재' },
  '삼나무판': { cat: 'finishing', name: '마감재' },
  '적삼목판': { cat: 'finishing', name: '마감재' },
  '대나무패널': { cat: 'finishing', name: '마감재' },
  '대나무직조패널': { cat: 'finishing', name: '마감재' },
  '코르크패널': { cat: 'finishing', name: '마감재' },
  '목재데크': { cat: 'finishing', name: '마감재' },
  'WPC데크': { cat: 'finishing', name: '마감재' },
  '재활용플라스틱데크': { cat: 'finishing', name: '마감재' },
  '재활용목재사이딩': { cat: 'finishing', name: '마감재' },
  '바이오복합패널': { cat: 'finishing', name: '마감재' },
  '재활용플라스틱패널': { cat: 'finishing', name: '마감재' },
  '재활용유리패널': { cat: 'finishing', name: '마감재' },
  '녹화시스템': { cat: 'finishing', name: '마감재' },

  // 마감재 - 외벽 전용
  '일반형 베이스패널': { cat: 'finishing', name: '마감재' },
  'UBC 알루미늄캔': { cat: 'finishing', name: '마감재' },
  'ALC i': { cat: 'finishing', name: '마감재' },
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
      const existingCat = String(row.getCell(5).value || '').trim();
      if (existingCat) return; // 이미 있으면 스킵

      if (categoryMap[name]) {
        row.getCell(5).value = categoryMap[name].cat;
        row.getCell(6).value = categoryMap[name].name;
        count++;
      } else {
        console.log('NOT FOUND:', sheetName, name);
      }
    });
    console.log(sheetName + ':', count + ' categorized');
    total += count;
  });

  await wb.xlsx.writeFile('data/materials01.xlsx');
  console.log('Total:', total);
})();
