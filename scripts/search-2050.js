/**
 * 2050 Materials API 검색
 *
 * 사용법:
 *   npm run epd -- MDF
 *   npm run epd -- "gypsum board"
 *   npm run epd -- ceiling
 *   npm run epd -- aluminum -t Metal
 *   npm run epd -- -t Concrete -c Korea
 */

const https = require('https');

const DEV_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzY5MzAwODIsImV4cCI6MjA5MjI5MDA4MiwidG9rZW5fdHlwZSI6ImRldmVsb3Blcl9hY2Nlc3MiLCJmaXJzdF9uYW1lIjoiXHVhZTQwXHVhYzAwXHVkNzZjIiwibGFzdF9uYW1lIjoiS2ltIiwib2NjdXBhdGlvbiI6IkFyY2hpdGVjdCIsInVzZXJfY29tcGFueSI6Ikp1bmdsaW0iLCJ1c2VyX2VtYWlsIjoia2F6emFuZ0B5b25zZWkuYWMua3IifQ.h9J6TeOTcmC5lFMAb0LV-7qwgjFncoM-U3aWlTfvxLo';

// 키워드 → material_type 자동 매핑
const TYPE_HINTS = {
  mdf: 'Wood', plywood: 'Wood', timber: 'Wood', wood: 'Wood', osb: 'Wood',
  gypsum: 'Gypsum', plaster: 'Gypsum',
  concrete: 'Concrete', cement: 'Concrete', mortar: 'Concrete',
  steel: 'Metal', aluminum: 'Metal', aluminium: 'Metal', metal: 'Metal', copper: 'Metal',
  glass: 'Glass', glazing: 'Glass',
  insulation: 'Insulation', xps: 'Insulation', eps: 'Insulation', rockwool: 'Insulation',
  paint: 'Paint', coating: 'Paint',
  tile: 'Ceramics', ceramic: 'Ceramics', brick: 'Ceramics',
  pvc: 'Plastic', polycarbonate: 'Plastic', plastic: 'Plastic',
  stone: 'Stone', marble: 'Stone', granite: 'Stone',
};

function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(data)); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function getAccessToken() {
  const result = await fetch('https://app.2050-materials.com/developer/api/getapitoken/', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${DEV_TOKEN}` }
  });
  return result.api_token;
}

async function searchProducts(token, keyword, options = {}) {
  const params = new URLSearchParams();
  if (options.type) params.set('material_type', options.type);
  if (options.country) params.set('manufacturing_country', options.country);

  const maxPages = options.pages || 10;
  const results = [];

  for (let page = 1; page <= maxPages; page++) {
    params.set('page', page);
    const url = `https://app.2050-materials.com/developer/api/get_products_open_api?${params}`;
    const data = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!data.results) break;

    for (const p of data.results) {
      const name = (p.name || '').toUpperCase();
      const ptype = (p.product_type || '').toUpperCase();
      const kw = keyword.toUpperCase();
      if (!keyword || name.includes(kw) || ptype.includes(kw)) {
        results.push(p);
      }
    }

    // 충분히 찾았으면 조기 종료
    if (results.length >= 30) break;
    if (!data.next) break;
  }

  return results;
}

function printResults(results) {
  if (results.length === 0) {
    console.log('No results found. Try: npm run epd -- MDF -t Wood');
    return;
  }

  console.log(`\n${results.length} results:\n`);
  console.log(`${'Name'.padEnd(48)} ${'Country'.padEnd(14)} ${'Unit'.padEnd(6)} A1-A3 GWP`);
  console.log('-'.repeat(85));

  for (const p of results.slice(0, 40)) {
    const mf = p.material_facts || {};
    console.log(
      `${(p.name || '').substring(0, 48).padEnd(48)} ` +
      `${(p.manufacturing_country || '').substring(0, 14).padEnd(14)} ` +
      `${(mf.declared_unit || '').padEnd(6)} ` +
      `${mf.manufacturing || '-'}`
    );
  }
  if (results.length > 40) console.log(`\n... +${results.length - 40} more`);
}

// 인자 파싱
const args = process.argv.slice(2);
let keyword = '';
const options = {};

for (let i = 0; i < args.length; i++) {
  if ((args[i] === '-t' || args[i] === '--type') && args[i+1]) { options.type = args[++i]; }
  else if ((args[i] === '-c' || args[i] === '--country') && args[i+1]) { options.country = args[++i]; }
  else if ((args[i] === '-p' || args[i] === '--pages') && args[i+1]) { options.pages = parseInt(args[++i]); }
  else if (!args[i].startsWith('-')) { keyword = args[i]; }
}

if (args.length === 0) {
  console.log('2050 Materials EPD Search\n');
  console.log('  npm run epd -- MDF');
  console.log('  npm run epd -- "gypsum board"');
  console.log('  npm run epd -- ceiling -t Wood');
  console.log('  npm run epd -- -t Concrete -c Korea');
  console.log('  npm run epd -- aluminum -t Metal -p 20');
  console.log('\nTypes: Wood, Concrete, Gypsum, Metal, Glass, Plastic, Insulation, Ceramics, Stone, Paint');
  process.exit(0);
}

// 타입 자동 추론
if (!options.type && keyword) {
  const hint = TYPE_HINTS[keyword.toLowerCase()];
  if (hint) {
    options.type = hint;
    console.log(`(auto type: ${hint})`);
  }
}

(async () => {
  try {
    const token = await getAccessToken();
    console.log(`Searching: "${keyword}"${options.type ? ` type=${options.type}` : ''}${options.country ? ` country=${options.country}` : ''}`);
    const results = await searchProducts(token, keyword, options);
    printResults(results);
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
