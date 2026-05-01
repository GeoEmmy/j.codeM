const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.OPENAI_API_KEY || process.argv[2];
if (!API_KEY) {
  console.error('Usage: node scripts/generate-images.js <OPENAI_API_KEY>');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: API_KEY });
const imagesDir = path.join(__dirname, '..', 'images');

// Load missing materials
const src = fs.readFileSync(path.join(__dirname, '..', 'data', 'epd-korea.js'), 'utf8');
const match = src.match(/const KOREAN_EPD = ([\s\S]*);/);
const data = JSON.parse(match[1]);

const existing = fs.readdirSync(imagesDir).map(f => f.replace(/\.(png|jpg|jpeg)$/i, '').toLowerCase());
const existingSet = new Set(existing);

const missing = [];
['floor', 'external', 'internal', 'ceiling', 'window'].forEach(s => {
  data[s].materials.forEach(mat => {
    if (mat.nameEn) {
      const key = mat.nameEn.toLowerCase();
      if (!existingSet.has(key)) {
        missing.push({ name: mat.name, nameEn: mat.nameEn });
      }
    }
  });
});

// Deduplicate by nameEn
const seen = new Set();
const uniqueMissing = missing.filter(m => {
  if (seen.has(m.nameEn)) return false;
  seen.add(m.nameEn);
  return true;
});

console.log(`${uniqueMissing.length} images to generate\n`);

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const stream = fs.createWriteStream(filepath);
      res.pipe(stream);
      stream.on('finish', () => { stream.close(); resolve(); });
      stream.on('error', reject);
    }).on('error', reject);
  });
}

async function generateImage(mat) {
  const prompt = `A realistic close-up texture photograph of ${mat.nameEn.replace(/_/g, ' ')} construction material, top-down view, even lighting, no text, no labels, square format, suitable as a material swatch thumbnail`;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    const url = response.data[0].url;
    const filepath = path.join(imagesDir, `${mat.nameEn}.png`);
    await downloadImage(url, filepath);
    console.log(`✅ ${mat.name} (${mat.nameEn}) → saved`);
    return true;
  } catch (err) {
    console.error(`❌ ${mat.name} (${mat.nameEn}) → ${err.message}`);
    return false;
  }
}

async function main() {
  let success = 0, fail = 0;
  for (const mat of uniqueMissing) {
    const ok = await generateImage(mat);
    if (ok) success++;
    else fail++;
    // Rate limit: wait 1.5s between requests
    await new Promise(r => setTimeout(r, 1500));
  }
  console.log(`\nDone: ${success} generated, ${fail} failed`);
}

main();
