/**
 * EPD 통합 검색 (EC3 로컬 + Ökobaudat 로컬 + 2050 Materials API)
 * 모든 결과를 kgCO₂e/m³로 통일 변환하여 출력
 *
 * 사용법:
 *   node scripts/search-epd.js MDF
 *   node scripts/search-epd.js gypsum -u m2
 *   node scripts/search-epd.js ceiling -c Ceilings
 *   node scripts/search-epd.js MDF --ec3       (EC3만)
 *   node scripts/search-epd.js MDF --obd       (Ökobaudat만)
 *   node scripts/search-epd.js MDF --2050      (2050만)
 */

const fs = require('fs');
const https = require('https');

// ===== 자재 키워드별 추정 밀도 (kg/m³) =====
const EST_DENSITY = [
  // 금속
  [/stainless|inox/i, 7900], [/steel|stahl/i, 7850], [/iron|eisen/i, 7870],
  [/copper|kupfer|bronze|brass/i, 8900], [/aluminum|aluminium/i, 2700],
  [/zinc|zink/i, 7130], [/titanium|titan/i, 4510], [/lead|blei/i, 11340],
  // 목재
  [/osb/i, 620], [/mdf/i, 750], [/plywood|sperrholz/i, 600], [/particle.?board/i, 650],
  [/clt|cross.?lam/i, 470], [/lvl|laminated.?veneer/i, 510], [/glulam|brettschicht/i, 450],
  [/timber|holz|lumber|softwood|nadelholz/i, 500], [/hardwood|laubholz/i, 650],
  [/bamboo|bambus/i, 700], [/cork|kork/i, 120],
  // 콘크리트/석재
  [/uhpc/i, 2500], [/concrete|beton/i, 2400], [/mortar|m[oö]rtel/i, 1800],
  [/cement|zement/i, 1500], [/gypsum|gips/i, 1000], [/calcium.?silicate/i, 1100],
  [/limestone|kalkstein/i, 2300], [/marble|marmor/i, 2700], [/granite|granit/i, 2700],
  [/sandstone|sandstein/i, 2200], [/slate|schiefer/i, 2800],
  [/brick|ziegel|klinker/i, 1800], [/block|stein/i, 1800],
  [/alc|autoclaved/i, 500], [/terrazzo/i, 2200],
  // 단열
  [/eps/i, 20], [/xps/i, 35], [/pur|polyurethane|pir/i, 32],
  [/rock.?wool|steinwolle|mineral.?wool|mineralwolle/i, 100],
  [/glass.?wool|glaswolle/i, 25], [/cellulose|zellulose/i, 55],
  [/hemp|hanf/i, 40], [/wood.?fiber|holzfaser/i, 160], [/wool.*insul/i, 25],
  [/foam.?glass|schaumglas/i, 120], [/perlite|perlit/i, 90], [/vermiculite/i, 80],
  // 유리
  [/glass|glas/i, 2500],
  // 플라스틱
  [/etfe/i, 1700], [/polycarbonate|polycarbonat/i, 1200], [/pvc/i, 1400],
  [/acrylic|acryl|pmma/i, 1180], [/epoxy|epoxid/i, 1200],
  [/polyester/i, 1350], [/rubber|gummi|kautschuk|epdm/i, 1150],
  [/linoleum/i, 1200], [/vinyl/i, 1300],
  // 도료/마감
  [/paint|farbe|anstrich|lack/i, 1300], [/plaster|putz/i, 1800],
  [/render|beschichtung/i, 1800], [/wallpaper|tapete/i, 400],
  // 세라믹
  [/ceramic|keramik|porcelain|fliese|tile/i, 2000],
  [/grc|gfrc|glass.?fiber.?reinf/i, 2000],
  // 지붕/방수
  [/bitumen/i, 1050], [/membrane|membran/i, 1200],
  // 보드
  [/fiber.?cement|faserzement/i, 1300],
  [/gypsum.?board|gipskarton|gipsplatte/i, 800],
];

// ===== 자재 키워드별 추정 두께 (m) =====
const EST_THICKNESS = [
  // 외장패널
  [/facade|fassade|cladding|siding/i, 0.010],
  [/panel|paneel|platte/i, 0.015],
  [/curtain.?wall/i, 0.020],
  // 내장
  [/gypsum.?board|gipskarton/i, 0.0125],
  [/wallpaper|tapete/i, 0.001],
  [/paint|farbe|anstrich|lack|primer/i, 0.0003],
  [/plaster|putz|render/i, 0.015],
  // 바닥
  [/flooring|bodenbelag|parquet|parkett/i, 0.015],
  [/tile|fliese/i, 0.010],
  [/carpet|teppich/i, 0.008],
  [/linoleum|vinyl/i, 0.003],
  [/laminate|laminat/i, 0.008],
  // 지붕/방수
  [/membrane|membran|foil|folie/i, 0.002],
  [/bitumen|roofing/i, 0.005],
  [/epdm/i, 0.002],
  [/etfe/i, 0.0002],
  // 유리
  [/glass|glas|glazing|verglasung/i, 0.006],
  // 단열
  [/insulation|d[aä]mm/i, 0.100],
  // 문/창
  [/door|t[uü]r/i, 0.050],
  [/window|fenster/i, 0.030],
  // 벽돌/블록
  [/brick|ziegel|block|stein|masonry|mauerwerk/i, 0.115],
  // 보드 일반
  [/board|platte/i, 0.012],
];

function estimateDensity(name, category) {
  const text = `${name} ${category}`;
  for (const [re, val] of EST_DENSITY) {
    if (re.test(text)) return val;
  }
  return null;
}

function estimateThickness(name, category) {
  const text = `${name} ${category}`;
  for (const [re, val] of EST_THICKNESS) {
    if (re.test(text)) return val;
  }
  return null;
}

// ===== 단위 변환: → kgCO₂e/m³ =====
function toPerM3(gwpRaw, unitStr, density, thickness, areaWeight, name, category) {
  const gwp = parseFloat(gwpRaw);
  if (isNaN(gwp)) return { gwpM3: null, method: '', estDensity: null, estThickness: null };

  const u = (unitStr || '').toLowerCase().replace(/\^/g, '');
  const qtyMatch = u.match(/([\d.]+)\s*/);
  const qty = qtyMatch ? parseFloat(qtyMatch[1]) || 1 : 1;
  const gwpPerUnit = gwp / qty;

  let d = parseFloat(density) || 0;
  let t = parseFloat(thickness) || 0;
  const aw = parseFloat(areaWeight) || 0;
  let estD = null, estT = null;

  if (u.includes('m3')) {
    return { gwpM3: gwpPerUnit, method: 'direct', estDensity: null, estThickness: null };
  }

  if (u.includes('kg')) {
    if (d > 0) {
      return { gwpM3: gwpPerUnit * d, method: 'kg×ρ', estDensity: null, estThickness: null };
    }
    estD = estimateDensity(name, category);
    if (estD) {
      return { gwpM3: gwpPerUnit * estD, method: 'kg×ρ~', estDensity: estD, estThickness: null };
    }
    return { gwpM3: null, method: 'no ρ', estDensity: null, estThickness: null };
  }

  if (u.includes('m2') || u.includes('qm')) {
    if (t > 0) {
      return { gwpM3: gwpPerUnit / t, method: 'm²÷t', estDensity: null, estThickness: null };
    }
    if (aw > 0 && d > 0) {
      const calcT = aw / d;
      return { gwpM3: gwpPerUnit / calcT, method: 'm²÷(aw/ρ)', estDensity: null, estThickness: null };
    }
    if (aw > 0 && !d) {
      estD = estimateDensity(name, category);
      if (estD) {
        const calcT = aw / estD;
        return { gwpM3: gwpPerUnit / calcT, method: 'm²÷(aw/ρ~)', estDensity: estD, estThickness: calcT };
      }
    }
    estT = estimateThickness(name, category);
    if (estT) {
      return { gwpM3: gwpPerUnit / estT, method: 'm²÷t~', estDensity: null, estThickness: estT };
    }
    return { gwpM3: null, method: 'no t', estDensity: null, estThickness: null };
  }

  // m, pcs 등 기타 단위
  return { gwpM3: null, method: u, estDensity: null, estThickness: null };
}

function fmtGwp(v) {
  if (v === null || v === undefined || isNaN(v)) return '-';
  const abs = Math.abs(v);
  if (abs >= 1000) return v.toFixed(0);
  if (abs >= 10) return v.toFixed(1);
  return v.toFixed(2);
}

// ===== Ökobaudat 로컬 DB =====
const OBD_XLSX = 'V:/03 기획 과제/25 04 30 LCA설계 가이드라인 _ 김가희/08 환경영향 DB/LCI/okobaudat/OBD_2024_I_2025-08-26T04_48_52_가공.xlsx';

let obdCache = null;
function loadOBD() {
  if (obdCache) return obdCache;
  if (!fs.existsSync(OBD_XLSX)) { obdCache = []; return obdCache; }
  const XLSX = require('xlsx');
  const wb = XLSX.readFile(OBD_XLSX);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws);
  obdCache = data.filter(r => r['Modul'] === 'A1-A3' && (r['GWPtotal (A2)'] || r['GWP']));
  return obdCache;
}

function searchOBD(keyword, options) {
  const rows = loadOBD();
  const kw = keyword.toUpperCase();
  return rows.filter(row => {
    const nameEn = (row['Name (en)'] || '').toUpperCase();
    const nameDe = (row['Name (de)'] || '').toUpperCase();
    const catEn = (row['Kategorie (en)'] || '').toUpperCase();
    return (!keyword || nameEn.includes(kw) || nameDe.includes(kw))
      && (!options.cat || catEn.includes(options.cat.toUpperCase()));
  }).map(r => {
    const gwpRaw = r['GWPtotal (A2)'] || r['GWP'] || '-';
    const qty = parseFloat(r['Bezugsgroesse']) || 1;
    const unitRaw = r['Bezugseinheit'] || '';
    const unitStr = `${qty} ${unitRaw}`;
    const density = r['밀도Rohdichte (kg/m3)'] || '';
    const thickness = r['Schichtdicke (m)'] || '';
    const areaWeight = r['Flaechengewicht (kg/m2)'] || '';
    const nameStr = r['Name (en)'] || r['Name (de)'] || '';
    const catStr = r['Kategorie (en)'] || '';
    const conv = toPerM3(gwpRaw, unitStr, density, thickness, areaWeight, nameStr, catStr);
    return {
      name: nameStr,
      category: catStr,
      unitOrig: unitStr,
      gwpOrig: gwpRaw,
      gwpM3: conv.gwpM3,
      method: conv.method,
      density: density ? parseFloat(density) : conv.estDensity,
      densityEst: !density && conv.estDensity ? true : false,
      thickness: thickness ? parseFloat(thickness) : conv.estThickness,
      thicknessEst: !thickness && conv.estThickness ? true : false,
      source: 'OBD'
    };
  });
}

// ===== EC3 로컬 DB =====
const EC3_CSV = 'D:/06 ec3 epd collect/ec3_all_epds_merged.csv';

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { result.push(current); current = ''; }
    else { current += ch; }
  }
  result.push(current);
  return result;
}

function loadEC3() {
  if (!fs.existsSync(EC3_CSV)) return [];
  const content = fs.readFileSync(EC3_CSV, 'utf8');
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0].replace(/^\uFEFF/, ''));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
    rows.push(row);
  }
  return rows;
}

function searchEC3(rows, keyword, options) {
  const kw = keyword.toUpperCase();
  return rows.filter(row => {
    const name = (row.name || '').toUpperCase();
    const cat = (row['category.name'] || '').toUpperCase();
    const subcat = (row['subcategory.name'] || '').toUpperCase();

    return (!keyword || name.includes(kw) || subcat.includes(kw))
      && (!options.cat || cat.includes(options.cat.toUpperCase()) || subcat.includes(options.cat.toUpperCase()));
  }).map(r => {
    const gwpRaw = r.gwp_reported || r.gwp || '-';
    const unitStr = r.declared_unit || '';
    const nameStr = r.name || '';
    const catStr = r['subcategory.name'] || r['category.name'] || '';
    const conv = toPerM3(gwpRaw, unitStr, null, null, null, nameStr, catStr);
    return {
      name: nameStr,
      category: catStr,
      unitOrig: unitStr,
      gwpOrig: gwpRaw,
      gwpM3: conv.gwpM3,
      method: conv.method,
      density: conv.estDensity || null,
      densityEst: conv.estDensity ? true : false,
      thickness: conv.estThickness || null,
      thicknessEst: conv.estThickness ? true : false,
      source: 'EC3'
    };
  });
}

// ===== 2050 Materials API =====
const DEV_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzY5MzAwODIsImV4cCI6MjA5MjI5MDA4MiwidG9rZW5fdHlwZSI6ImRldmVsb3Blcl9hY2Nlc3MiLCJmaXJzdF9uYW1lIjoiXHVhZTQwXHVhYzAwXHVkNzZjIiwibGFzdF9uYW1lIjoiS2ltIiwib2NjdXBhdGlvbiI6IkFyY2hpdGVjdCIsInVzZXJfY29tcGFueSI6Ikp1bmdsaW0iLCJ1c2VyX2VtYWlsIjoia2F6emFuZ0B5b25zZWkuYWMua3IifQ.h9J6TeOTcmC5lFMAb0LV-7qwgjFncoM-U3aWlTfvxLo';

const TYPE_HINTS = {
  mdf: 'Wood', plywood: 'Wood', timber: 'Wood', wood: 'Wood', osb: 'Wood',
  gypsum: 'Gypsum', plaster: 'Gypsum',
  concrete: 'Concrete', cement: 'Concrete', mortar: 'Concrete',
  steel: 'Metal', aluminum: 'Metal', aluminium: 'Metal', metal: 'Metal',
  glass: 'Glass', glazing: 'Glass',
  insulation: 'Insulation', xps: 'Insulation', eps: 'Insulation', rockwool: 'Insulation',
  paint: 'Paint', coating: 'Paint',
  tile: 'Ceramics', ceramic: 'Ceramics', brick: 'Ceramics',
  pvc: 'Plastic', polycarbonate: 'Plastic', plastic: 'Plastic', frp: 'Plastic',
  stone: 'Stone', marble: 'Stone', granite: 'Stone',
};

function httpGet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch { reject(new Error(data)); } });
    });
    req.on('error', reject);
    req.end();
  });
}

async function search2050(keyword, options) {
  try {
    const tokenRes = await httpGet('https://app.2050-materials.com/developer/api/getapitoken/', {
      'Authorization': `Bearer ${DEV_TOKEN}`
    });
    const token = tokenRes.api_token;

    const params = new URLSearchParams();
    const matType = options.type || TYPE_HINTS[keyword.toLowerCase()] || '';
    if (matType) params.set('material_type', matType);

    const results = [];
    for (let page = 1; page <= 8; page++) {
      params.set('page', page);
      const data = await httpGet(
        `https://app.2050-materials.com/developer/api/get_products_open_api?${params}`,
        { 'Authorization': `Bearer ${token}` }
      );
      if (!data.results) break;
      for (const p of data.results) {
        const name = (p.name || '').toUpperCase();
        if (!keyword || name.includes(keyword.toUpperCase())) {
          const mf = p.material_facts || {};
          const unitStr = mf.declared_unit || '';
          const density = mf.density || null;
          const thickness = mf.thickness || null;
          const gwpRaw = mf.manufacturing || '-';
          const nameStr = p.name || '';
          const catStr = p.product_type || '';
          const conv = toPerM3(gwpRaw, unitStr, density, thickness, null, nameStr, catStr);
          results.push({
            name: nameStr,
            category: catStr,
            unitOrig: unitStr,
            gwpOrig: gwpRaw,
            gwpM3: conv.gwpM3,
            method: conv.method,
            density: density ? parseFloat(density) : conv.estDensity,
            densityEst: !density && conv.estDensity ? true : false,
            thickness: thickness ? parseFloat(thickness) : conv.estThickness,
            thicknessEst: !thickness && conv.estThickness ? true : false,
            source: '2050'
          });
        }
      }
      if (results.length >= 20 || !data.next) break;
    }
    return results;
  } catch (e) {
    console.log(`  2050 API error: ${e.message}`);
    return [];
  }
}

// ===== 출력 =====
function printResults(results) {
  if (results.length === 0) {
    console.log('No results found.');
    return;
  }

  console.log(`\n${results.length} results (all converted to kgCO₂e/m³):\n`);
  console.log(
    `${'[DB]'.padEnd(6)} ` +
    `${'Name'.padEnd(42)} ` +
    `${'GWP/m³'.padStart(10)} ` +
    `${'원본GWP'.padStart(10)} ` +
    `${'원본단위'.padEnd(8)} ` +
    `${'밀도'.padStart(6)} ` +
    `${'두께(m)'.padStart(7)} ` +
    `변환`
  );
  console.log('-'.repeat(105));

  for (const r of results.slice(0, 50)) {
    const tag = r.source === 'EC3' ? '[EC3]' : r.source === 'OBD' ? '[OBD]' : '[2050]';
    const gwpM3Str = r.gwpM3 !== null ? fmtGwp(r.gwpM3) : '?';
    const gwpOrigStr = typeof r.gwpOrig === 'number' ? fmtGwp(r.gwpOrig) : String(r.gwpOrig).substring(0, 10);
    const densityStr = r.density ? (r.densityEst ? '~' : '') + String(Math.round(r.density)) : '-';
    const thicknessStr = r.thickness ? (r.thicknessEst ? '~' : '') + String(r.thickness) : '-';

    console.log(
      `${tag.padEnd(6)} ` +
      `${r.name.substring(0, 42).padEnd(42)} ` +
      `${gwpM3Str.padStart(10)} ` +
      `${gwpOrigStr.padStart(10)} ` +
      `${(r.unitOrig || '').substring(0, 8).padEnd(8)} ` +
      `${densityStr.padStart(6)} ` +
      `${thicknessStr.padStart(7)} ` +
      `${r.method}`
    );
  }
  if (results.length > 50) console.log(`\n... +${results.length - 50} more`);
}

// ===== 메인 =====
const args = process.argv.slice(2);
let keyword = '';
const options = { ec3Only: false, api2050Only: false, obdOnly: false };

for (let i = 0; i < args.length; i++) {
  if ((args[i] === '-c' || args[i] === '--cat') && args[i+1]) { options.cat = args[++i]; }
  else if ((args[i] === '-u' || args[i] === '--unit') && args[i+1]) { options.unit = args[++i]; }
  else if ((args[i] === '-t' || args[i] === '--type') && args[i+1]) { options.type = args[++i]; }
  else if (args[i] === '--ec3') { options.ec3Only = true; }
  else if (args[i] === '--2050') { options.api2050Only = true; }
  else if (args[i] === '--obd') { options.obdOnly = true; }
  else if (!args[i].startsWith('-')) { keyword += (keyword ? ' ' : '') + args[i]; }
}

if (args.length === 0) {
  console.log('EPD Search (EC3 99K + Ökobaudat 2.3K + 2050 Materials API)\n');
  console.log('All results converted to kgCO₂e/m³\n');
  console.log('  /epd MDF              MDF 검색 (전체)');
  console.log('  /epd gypsum           석고 검색');
  console.log('  /epd ceiling -c Ceilings  천장재 카테고리');
  console.log('  /epd MDF --ec3        EC3만');
  console.log('  /epd MDF --obd        Ökobaudat만');
  console.log('  /epd MDF --2050       2050 Materials만');
  console.log('  /epd frp -t Plastic   타입 지정');
  process.exit(0);
}

(async () => {
  let allResults = [];
  const onlyOne = options.ec3Only || options.obdOnly || options.api2050Only;

  // EC3 로컬
  if (!onlyOne || options.ec3Only) {
    process.stdout.write('EC3 loading... ');
    const ec3Rows = loadEC3();
    const ec3Results = searchEC3(ec3Rows, keyword, options);
    console.log(`${ec3Results.length} found`);
    allResults = allResults.concat(ec3Results);
  }

  // Ökobaudat 로컬
  if (!onlyOne || options.obdOnly) {
    process.stdout.write('Ökobaudat loading... ');
    const obdResults = searchOBD(keyword, options);
    console.log(`${obdResults.length} found`);
    allResults = allResults.concat(obdResults);
  }

  // 2050 Materials API
  if (!onlyOne || options.api2050Only) {
    process.stdout.write('2050 API... ');
    const apiResults = await search2050(keyword, options);
    console.log(`${apiResults.length} found`);
    allResults = allResults.concat(apiResults);
  }

  printResults(allResults);
})();
