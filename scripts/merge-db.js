/**
 * C:/db/db.csv → materials_gwp_simple.csv 병합
 * 중복 제거, 단위 변환, 구조체 분류
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = 'C:/db/db.csv';
const CSV_PATH = path.join(__dirname, '../data/materials_gwp_simple.csv');

function parseCsvLine(l) {
  const parts = [];
  let current = '', inQ = false;
  for (let i = 0; i < l.length; i++) {
    if (l[i] === '"') inQ = !inQ;
    else if (l[i] === ',' && !inQ) { parts.push(current.trim()); current = ''; }
    else current += l[i];
  }
  parts.push(current.trim());
  return parts;
}

// 1. 기존 CSV 이름 수집
const existCsv = fs.readFileSync(CSV_PATH, 'utf8');
const existNames = new Set();
existCsv.split('\n').slice(1).forEach(l => {
  const name = l.split(',')[1];
  if (name) existNames.add(name.trim().toLowerCase().replace(/[\s()]/g, ''));
});

function isDuplicate(name) {
  const key = name.toLowerCase().replace(/[\s()]/g, '');
  for (const en of existNames) {
    if (en.includes(key) || key.includes(en) || en === key) return true;
  }
  return false;
}

// 2. 단위 변환
function convertGwp(carbon, unit, density) {
  const u = unit.toLowerCase();
  if (u === 'm3') return { gwp: Math.round(carbon * 100) / 100, unit: 'kgCO2e/m³' };
  if (u === 'm2') return { gwp: Math.round(carbon * 100) / 100, unit: 'kgCO2e/m²' };
  if (u === 'kg') return { gwp: Math.round(carbon * density * 100) / 100, unit: 'kgCO2e/m³' };
  if (u === 'ton') return { gwp: Math.round(carbon * (density / 1000) * 100) / 100, unit: 'kgCO2e/m³' };
  if (u === 'box') return { gwp: Math.round(carbon / 3.24 * 100) / 100, unit: 'kgCO2e/m²' };
  if (u === '개' || u === 'm') return null;
  return { gwp: Math.round(carbon * 100) / 100, unit: 'kgCO2e/m³' };
}

// 3. 구조체 분류
function classify(name, engName) {
  const n = (name + ' ' + engName).toLowerCase();

  // 창호
  if (n.includes('유리') || n.includes('glass') || n.includes('glazing') || n.includes('window') ||
      n.includes('커튼월') || n.includes('창틀') || n.includes('bipv') || n.includes('etfe'))
    return { struct: '창호', catName: '유리' };

  // 외벽
  if (n.includes('징크') || n.includes('zinc') || n.includes('테라코타') || n.includes('세라믹패널') ||
      n.includes('라임스톤') || n.includes('lime stone') || n.includes('화강') || n.includes('granite') ||
      n.includes('메탈메쉬') || n.includes('metal mesh') || n.includes('목재패널') || n.includes('wood panel') ||
      n.includes('탄화목') || n.includes('흙다짐') || n.includes('rammed') || n.includes('경량벽체') ||
      n.includes('partition') || n.includes('그라스울샌드위치') || n.includes('epdm') ||
      n.includes('경량목구조') || n.includes('clt') || n.includes('대나무') || n.includes('bamboo') ||
      n.includes('흡음패브릭') || n.includes('대마콘크리트') || n.includes('hempcrete') ||
      n.includes('폴리카보네이트') || n.includes('polycarbonate'))
    return { struct: '외벽', catName: '외장재' };

  // 내벽
  if (n.includes('석회미장') || n.includes('plaster') || n.includes('흡음재') || n.includes('polyester') ||
      n.includes('pvc film') || n.includes('필름'))
    return { struct: '내벽', catName: '마감재' };

  // 바닥 - 방수
  if (n.includes('방수') || n.includes('waterproof'))
    return { struct: '바닥', catName: '방수재' };

  // 바닥 - 단열
  if (n.includes('그라스울') || n.includes('glass wool') || n.includes('폴리우레탄') || n.includes('polyurethan') ||
      n.includes('xps') || n.includes('eps') || n.includes('폴리스티렌') || n.includes('hdpe') ||
      n.includes('양모') || n.includes('wool'))
    return { struct: '바닥', catName: '단열재' };

  // 바닥 - 구조재
  if (n.includes('콘크리트') || n.includes('concrete') || n.includes('레미콘') || n.includes('시멘트') ||
      n.includes('cement') || n.includes('철근') || n.includes('rebar') || n.includes('형강') ||
      n.includes('steel beam') || n.includes('강판') || n.includes('steel sheet') || n.includes('데크') ||
      n.includes('deck') || n.includes('스테인레스') || n.includes('stainless') ||
      n.includes('아연도각관') || n.includes('square pipe') || n.includes('에폭시') || n.includes('epoxy') ||
      n.includes('레미탈') || n.includes('mortar') || n.includes('재활용알루미늄') || n.includes('recycled'))
    return { struct: '바닥', catName: '구조재' };

  // 바닥 - 마감재
  if (n.includes('타일') || n.includes('tile') || n.includes('마루') || n.includes('flooring') ||
      n.includes('비닐') || n.includes('pvc') || n.includes('시트') || n.includes('sheet') ||
      n.includes('원목') || n.includes('합성목재') || n.includes('composite') ||
      n.includes('코르크') || n.includes('cork') || n.includes('바이오') || n.includes('이중바닥') ||
      n.includes('access') || n.includes('철재문') || n.includes('steel door'))
    return { struct: '바닥', catName: '마감재' };

  return { struct: '바닥', catName: '구조재' };
}

// 4. 파싱 & 병합
const dbCsv = fs.readFileSync(DB_PATH, 'utf8');
const dbLines = dbCsv.split('\n').filter(l => l.trim());

const newRows = [];
dbLines.slice(1).forEach(l => {
  const p = parseCsvLine(l);
  const name = p[0];
  const spec = p[1] || '';
  const origin = p[2] || '';
  const engName = p[3] || '';
  const unit = p[4] || '';
  const carbon = parseFloat(p[5]) || 0;
  const density = parseFloat(p[6]) || 0;

  if (!name || name === 'none' || carbon === 0) return;
  if (isDuplicate(name)) return;

  const converted = convertGwp(carbon, unit, density || 1000);
  if (!converted) return;

  const cls = classify(name, engName);

  let cleanName = name.replace(/\(.*?\)/g, '').replace(/\/kg/g, '').replace(/\s+/g, ' ').trim();
  if (cleanName.length > 15) cleanName = cleanName.substring(0, 14) + '…';

  newRows.push({
    struct: cls.struct,
    name: cleanName,
    cat: cls.catName,
    desc: spec,
    gwp: converted.gwp,
    unit: converted.unit,
    density: density || '',
    source: origin || '',
  });
});

// CSV에 추가
let csv = fs.readFileSync(CSV_PATH, 'utf8');
newRows.forEach(r => {
  const line = [
    r.struct, r.name, r.cat,
    '"' + r.desc.replace(/"/g, '""') + '"',
    r.gwp, r.unit, r.density,
    '"' + r.source.replace(/"/g, '""') + '"',
    ''
  ].join(',');
  csv += '\n' + line;
});

fs.writeFileSync(CSV_PATH, csv, 'utf8');

// 결과
console.log('추가: ' + newRows.length + '개');
const counts = {};
newRows.forEach(r => { counts[r.struct] = (counts[r.struct] || 0) + 1; });
Object.entries(counts).forEach(([k, v]) => console.log('  ' + k + ': ' + v));

const finalLines = csv.split('\n').filter(l => l.trim());
const finalCounts = {};
finalLines.slice(1).forEach(l => { const s = l.split(',')[0]; finalCounts[s] = (finalCounts[s] || 0) + 1; });
console.log('\n최종 CSV:');
Object.entries(finalCounts).forEach(([k, v]) => console.log('  ' + k + ': ' + v));
console.log('  총: ' + (finalLines.length - 1));
