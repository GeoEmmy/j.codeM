/**
 * EC3 EPD 로컬 DB 검색 (99,755 EPDs)
 *
 * 사용법:
 *   node scripts/search-ec3.js MDF
 *   node scripts/search-ec3.js "gypsum board"
 *   node scripts/search-ec3.js ceiling --cat Ceilings
 *   node scripts/search-ec3.js aluminum --unit m2
 */

const fs = require('fs');

const CSV_FILE = 'D:/06 ec3 epd collect/ec3_all_epds_merged.csv';

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

let _cache = null;

function loadDB() {
  if (_cache) return _cache;
  const content = fs.readFileSync(CSV_FILE, 'utf8');
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
  _cache = rows;
  return rows;
}

function search(rows, keyword, options = {}) {
  const kw = keyword.toUpperCase();
  return rows.filter(row => {
    const name = (row.name || '').toUpperCase();
    const cat = (row['category.name'] || '').toUpperCase();
    const subcat = (row['subcategory.name'] || '').toUpperCase();
    const unit = (row.declared_unit || '').toLowerCase();
    const mfr = (row['manufacturer.name'] || '').toUpperCase();

    const matchKw = !keyword || name.includes(kw) || subcat.includes(kw);
    const matchCat = !options.cat || cat.includes(options.cat.toUpperCase()) || subcat.includes(options.cat.toUpperCase());
    const matchUnit = !options.unit || unit.includes(options.unit.toLowerCase());

    return matchKw && matchCat && matchUnit;
  });
}

function printResults(results) {
  if (results.length === 0) {
    console.log('No results found.');
    return;
  }

  console.log(`\n${results.length} results:\n`);
  console.log(`${'Name'.padEnd(45)} ${'Category'.padEnd(22)} ${'Unit'.padEnd(8)} ${'GWP'.padEnd(12)} Manufacturer`);
  console.log('-'.repeat(110));

  for (const r of results.slice(0, 50)) {
    const name = (r.name || '').substring(0, 45);
    const cat = (r['subcategory.name'] || r['category.name'] || '').substring(0, 22);
    const unit = (r.declared_unit || '').substring(0, 8);
    const gwp = r.gwp_reported || r.gwp || '-';
    const mfr = (r['manufacturer.name'] || '').substring(0, 20);
    console.log(`${name.padEnd(45)} ${cat.padEnd(22)} ${unit.padEnd(8)} ${String(gwp).padEnd(12)} ${mfr}`);
  }
  if (results.length > 50) console.log(`\n... +${results.length - 50} more`);
}

// 인자 파싱
const args = process.argv.slice(2);
let keyword = '';
const options = {};

for (let i = 0; i < args.length; i++) {
  if ((args[i] === '--cat' || args[i] === '-c') && args[i+1]) { options.cat = args[++i]; }
  else if ((args[i] === '--unit' || args[i] === '-u') && args[i+1]) { options.unit = args[++i]; }
  else if (!args[i].startsWith('-')) { keyword += (keyword ? ' ' : '') + args[i]; }
}

if (args.length === 0) {
  console.log('EC3 EPD Local Search (99,755 EPDs)\n');
  console.log('  node scripts/search-ec3.js MDF');
  console.log('  node scripts/search-ec3.js "gypsum board"');
  console.log('  node scripts/search-ec3.js ceiling -c Ceilings');
  console.log('  node scripts/search-ec3.js aluminum -u m2');
  process.exit(0);
}

console.log('Loading EC3 DB...');
const rows = loadDB();
console.log(`${rows.length} EPDs loaded`);
console.log(`Searching: "${keyword}"${options.cat ? ` cat=${options.cat}` : ''}${options.unit ? ` unit=${options.unit}` : ''}`);

const results = search(rows, keyword, options);
printResults(results);
