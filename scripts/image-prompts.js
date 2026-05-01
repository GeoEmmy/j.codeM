/**
 * 이미지 없는 자재 프롬프트 목록
 * 기존 generate-all-images.js 스타일 참조
 *
 * 공통 래퍼: "A single 600x600mm square panel of {prompt}. Viewed from 45 degrees above.
 *            The panel thickness should be realistic and proportional to the 600mm width.
 *            Pure white background. No shadows, no text, no labels. One piece only.
 *            Clean product catalog material swatch style."
 *
 * 이미지 설정: 500x500px, 배경 흰색, 45도 위에서 바라본 뷰
 */

const materials = [
  // ===== EXTERNAL (외벽) =====
  { file: 'copper_plate', name: '동판', sheet: 'external',
    prompt: 'copper sheet cladding panel, about 3mm thick, warm reddish-brown polished copper surface with subtle hammered texture and natural metallic sheen' },
  { file: 'zinc_plate', name: '아연판', sheet: 'external',
    prompt: 'zinc sheet cladding panel, about 0.7mm thick, matte blue-gray zinc surface with natural patina development pattern, standing seam profile visible on edge' },
  { file: 'aluminum_sheet', name: '알루미늄', sheet: 'external',
    prompt: 'aluminum sheet panel, about 3mm thick, silver brushed aluminum surface with fine linear grain pattern and metallic reflective finish' },
  { file: 'steel_siding', name: '용융아연도금강판', sheet: 'external',
    prompt: 'hot-dip galvanized steel siding panel, about 0.5mm thick, silver-gray spangle pattern surface typical of galvanized coating, corrugated profile' },
  { file: 'etfe', name: 'ETFE', sheet: 'external',
    prompt: 'ETFE fluoropolymer membrane cushion panel, about 0.2mm thick, transparent/translucent glossy film with slight blue tint, pillow-like inflated cushion form showing pneumatic structure' },
  { file: 'recycled_aluminum_sheet', name: '재활용알루미늄', sheet: 'external',
    prompt: 'recycled aluminum sheet panel, about 3mm thick, matte silver aluminum surface with subtle recycled material texture, green recycling symbol embossed on corner' },
  { file: 'glass_block', name: '유리블록', sheet: 'external',
    prompt: 'glass block unit, about 80mm thick, translucent square glass block with wavy/ripple pattern inside, clear edges showing solid glass construction' },
  { file: 'standard_base_panel', name: '시멘트판넬', sheet: 'external',
    prompt: 'fiber cement flat panel, about 12mm thick, smooth light gray cement surface with fine uniform texture typical of flat cement board cladding' },
  { file: 'acrylic_panel', name: '아크릴패널', sheet: 'external',
    prompt: 'acrylic (PMMA) transparent panel, about 10mm thick, crystal clear glossy surface with glass-like transparency, polished edges showing solid acrylic cross-section' },
  { file: 'vinyl_siding', name: '비닐사이딩', sheet: 'external',
    prompt: 'vinyl siding panel, about 1.5mm thick, white/cream colored horizontal lap siding profile with wood-grain embossed texture, multiple courses visible' },
  { file: 'uhpc_panel', name: 'UHPC패널', sheet: 'external',
    prompt: 'ultra-high performance concrete (UHPC) facade panel, about 25mm thin, smooth dark gray concrete surface with extremely fine dense texture, sharp precise edges' },
  { file: 'grc_panel', name: 'GRC패널', sheet: 'external',
    prompt: 'glass fiber reinforced concrete (GRC/GFRC) facade panel, about 15mm thick, light gray smooth concrete surface with fine texture, thin lightweight panel showing fiber-reinforced edge' },
  { file: 'hpl_panel', name: 'HPL패널', sheet: 'external',
    prompt: 'high pressure laminate (HPL) facade panel, about 8mm thick, smooth matte dark charcoal surface with uniform solid color finish, compact laminate visible on edge' },
  { file: 'fiber_cement', name: '섬유시멘트패널', sheet: 'external',
    prompt: 'fiber cement facade panel, about 8mm thick, smooth medium gray surface with subtle fiber texture, clean flat panel for exterior cladding' },
  { file: 'ceramic_panel', name: '세라믹패널', sheet: 'external',
    prompt: 'ceramic facade panel (ventilated facade), about 14mm thick, smooth white glazed ceramic surface with clean edges, terracotta-colored body visible on cross-section' },
  { file: 'clay_tile', name: '점토타일', sheet: 'external',
    prompt: 'clay facade tile, about 15mm thick, natural warm terracotta/red-brown clay color with slight texture variation, unglazed matte surface' },
  { file: 'terracotta', name: '테라코타', sheet: 'external',
    prompt: 'terracotta rainscreen panel, about 30mm thick, warm orange-red baked clay color with horizontal hollow tube profile visible on cross-section, striated surface texture' },
  { file: 'cement_board', name: '시멘트보드', sheet: 'external',
    prompt: 'cement board panel, about 12mm thick, medium gray flat cement surface with fine aggregate texture visible, dense fiber cement composition on edge' },
  { file: 'fiber_cement_siding', name: '섬유시멘트사이딩', sheet: 'external',
    prompt: 'fiber cement lap siding board, about 8mm thick, painted white horizontal siding plank with wood-grain embossed texture, beveled lap profile' },
  { file: 'brick', name: '시멘트벽돌', sheet: 'external',
    prompt: 'cement brick unit, about 190x90x57mm, gray cement brick with smooth surface and sharp edges, dense concrete material visible' },
  { file: 'clay_brick', name: '점토벽돌', sheet: 'external',
    prompt: 'clay brick unit, about 190x90x57mm, traditional red-orange fired clay brick with slight surface texture variation and natural color mottling' },
  { file: 'alc_internal', name: 'ALC 블록', sheet: 'external',
    prompt: 'autoclaved lightweight concrete (ALC/AAC) block, about 100mm thick, white/light gray porous lightweight concrete with visible fine air bubble structure, very lightweight appearance' },
  { file: 'lightweight_concrete_block', name: '경량콘크리트블록', sheet: 'external',
    prompt: 'lightweight concrete block (CMU), about 190mm thick, light gray concrete masonry unit with visible lightweight aggregate (pumice) texture, hollow core visible on top' },
  { file: 'recycled_glass_tile', name: '재활용유리타일', sheet: 'external',
    prompt: 'recycled glass mosaic tile, about 8mm thick, translucent green/blue glass surface with visible recycled glass aggregate particles, glossy finish' },
  { file: 'glass_mosaic_tile', name: '유리모자이크타일', sheet: 'external',
    prompt: 'glass mosaic tile sheet, about 6mm thick, small 25x25mm glass tiles in blue/aqua gradient colors on mesh backing, glossy vitreous surface' },
  { file: 'clay_plaster', name: '점토미장', sheet: 'external',
    prompt: 'clay plaster finish panel, about 20mm thick, warm earthy brown natural clay surface with subtle organic texture and slight trowel marks, matte natural finish' },
  { file: 'sandstone', name: '샌드스톤', sheet: 'external',
    prompt: 'natural sandstone cladding panel, about 30mm thick, warm buff/tan sandstone surface with visible horizontal sedimentary layering and fine sand grain texture' },
  { file: 'limestone', name: '라임스톤', sheet: 'external',
    prompt: 'limestone cladding panel, about 30mm thick, creamy beige/ivory limestone surface with subtle fossil impressions and fine grain, honed matte finish' },
  { file: 'osb', name: 'OSB', sheet: 'external',
    prompt: 'oriented strand board (OSB) panel, about 18mm thick, characteristic random wood strand/flake pattern with mixed light and dark brown wood chips pressed together, visible strand orientation' },
  { file: 'sandwich_panel', name: '미네랄울샌드위치패널', sheet: 'external',
    prompt: 'mineral wool sandwich panel, about 100mm thick, two white/silver steel face sheets with yellow mineral wool insulation core visible on cross-section edge' },
  { file: 'hempcrete', name: '대마콘크리트블럭', sheet: 'external',
    prompt: 'hempcrete block, about 150mm thick, light beige/tan hemp-lime composite with visible hemp shiv (wood chip) particles mixed in lime binder, rough organic texture' },
  { file: 'lime_plaster', name: '석회미장', sheet: 'external',
    prompt: 'lime plaster finish panel, about 15mm thick, smooth off-white/cream lime plaster surface with subtle natural texture variation, traditional troweled matte finish' },
  { file: 'reclaimed_brick', name: '재사용벽돌', sheet: 'external',
    prompt: 'reclaimed/salvaged brick, about 190x90x57mm, weathered red-brown brick with aged patina, old mortar residue on surfaces, slight chips and character marks showing reuse' },
  { file: 'adobe_brick', name: '흙벽돌', sheet: 'external',
    prompt: 'adobe/earth brick, about 200x100x60mm, natural brown unfired earth brick with straw fiber visible in the clay mix, rough handmade texture and organic appearance' },
  { file: 'wood_siding', name: '목재사이딩', sheet: 'external',
    prompt: 'natural wood cladding/siding board, about 20mm thick, warm cedar wood grain with horizontal lap profile, natural reddish-brown wood color with visible grain lines' },
];

module.exports = materials;

// 직접 실행 시 목록 출력
if (require.main === module) {
  console.log(`총 ${materials.length}개 자재 이미지 프롬프트\n`);
  console.log('시트별:');
  const bySheet = {};
  materials.forEach(m => { bySheet[m.sheet] = (bySheet[m.sheet] || 0) + 1; });
  Object.entries(bySheet).forEach(([s, n]) => console.log(`  ${s}: ${n}개`));
  console.log('\n--- 목록 ---');
  materials.forEach((m, i) => {
    console.log(`${(i+1).toString().padStart(2)}. [${m.sheet}] ${m.file} (${m.name})`);
    console.log(`    ${m.prompt}\n`);
  });
}
