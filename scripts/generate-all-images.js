const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({ apiKey: fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8').split('=')[1].trim() });
const imagesDir = path.join(__dirname, '..', 'images');

const materials = [
  { file: 'vinyl_sheet', name: '비닐시트', prompt: 'vinyl sheet flooring material, about 2mm thin, flexible surface with a light gray wood-grain printed pattern typical of vinyl sheet flooring' },
  { file: 'liquid_waterproofing', name: '액체방수', prompt: 'liquid waterproofing coating membrane, about 3mm thin, smooth glossy dark green/teal surface typical of liquid-applied waterproofing' },
  { file: 'pvc_tile', name: 'PVC타일', prompt: 'PVC floor tile, about 3mm thin, surface has a light brown wood-grain pattern typical of luxury vinyl tile (LVT)' },
  { file: 'ceramic_tile', name: '세라믹타일', prompt: 'ceramic floor tile, about 8mm thick, white glossy glazed surface with subtle texture typical of ceramic bathroom/kitchen tile' },
  { file: 'vacuum_insulation_panel', name: '진공단열재', prompt: 'vacuum insulation panel (VIP), about 20mm thick, wrapped in silver metallic foil envelope with visible sealed edges typical of VIP insulation' },
  { file: 'low_carbon_concrete', name: '저탄소 콘크리트', prompt: 'low carbon concrete panel, about 50mm thick, exposed concrete surface with light gray color and subtle aggregate texture' },
  { file: 'cement_mortar', name: '시멘트모르타르', prompt: 'cement mortar panel, about 30mm thick, rough gray cement surface texture with fine sand aggregate visible' },
  { file: 'xps', name: 'XPS', prompt: 'XPS extruded polystyrene insulation board, about 50mm thick, distinctive light blue/sky blue color with smooth closed-cell foam texture and visible cell structure on cross-section edge' },
  { file: 'composite_wood_deck', name: '합성목재데크', prompt: 'wood plastic composite (WPC) decking board, about 25mm thick, brown wood-grain textured surface with visible hollow or solid core structure on cross-section, grooved pattern on top' },
  { file: 'granite', name: '화강석', prompt: 'granite stone floor tile, about 20mm thick, polished surface with natural black and gray speckled crystal pattern typical of absolute black granite' },
  { file: 'marble', name: '대리석', prompt: 'natural marble floor tile, about 20mm thick, polished white surface with distinctive gray/dark veining pattern typical of Carrara marble' },
  { file: 'concrete', name: '콘크리트', prompt: 'exposed concrete panel, about 60mm thick, raw concrete surface with form marks and medium gray color with visible fine aggregate' },
  { file: 'rigid_urethane_foam', name: '경질우레탄폼', prompt: 'rigid polyurethane foam insulation board, about 50mm thick, yellow/cream colored closed-cell foam with aluminum foil facing on one side, visible foam cell structure on cross-section' },
  { file: 'carpet_tile', name: '카펫타일', prompt: 'carpet tile, about 6mm thick, dark charcoal gray loop pile carpet surface texture with subtle stripe pattern, visible bitumen backing layer on cross-section edge' },
  { file: 'expanded_perlite', name: '팽창퍼라이트', prompt: 'expanded perlite insulation board, about 40mm thick, white/off-white lightweight granular porous texture with visible small round perlite particles' },
  { file: 'rock_wool', name: '암면', prompt: 'rock wool (stone wool) insulation board, about 50mm thick, yellowish-brown fibrous mineral wool texture with dense layered fiber structure visible on cross-section' },
  { file: 'eps', name: 'EPS', prompt: 'EPS expanded polystyrene insulation board, about 50mm thick, white foam with characteristic visible round bead/pellet texture typical of styrofoam, lightweight appearance' },
  { file: 'glass_wool_board', name: '그라스울보온판', prompt: 'glass wool insulation board, about 50mm thick, yellow fiberglass wool texture with fine glass fiber structure, wrapped in yellow kraft paper facing on one side' },
  { file: 'phenolic_foam_board', name: 'PF보드', prompt: 'phenolic foam insulation board, about 40mm thick, dark reddish-brown/maroon colored closed-cell foam with aluminum foil facing on one side' },
  { file: 'bio_polyurethane_flooring', name: '바이오폴리우레탄바닥재', prompt: 'bio-based polyurethane flooring, about 4mm thick, smooth matte light gray/beige surface with subtle speckled pattern typical of seamless resin flooring' },
  { file: 'bamboo_structural', name: '대나무구조재', prompt: 'structural bamboo lumber panel, about 30mm thick, natural bamboo color with visible horizontal laminated bamboo strip grain pattern, showing bamboo node marks' },
  { file: 'hemp_insulation', name: '헴프단열재', prompt: 'hemp fiber insulation board, about 50mm thick, natural greenish-brown hemp fiber texture with loose fibrous structure visible, organic natural material appearance' },
  { file: 'wool_insulation', name: '양모단열재', prompt: 'sheep wool insulation board, about 50mm thick, natural off-white/cream fluffy wool fiber texture with soft puffy appearance typical of natural wool insulation batts' },
  { file: 'paper_wool', name: '셀룰로오스단열재', prompt: 'cellulose insulation board, about 50mm thick, gray recycled paper fiber texture with dense compressed newspaper fiber appearance' },
  { file: 'recycled_aggregate_concrete', name: '재활용골재콘크리트', prompt: 'recycled aggregate concrete panel, about 50mm thick, concrete surface with visible mixed-color recycled aggregate (crushed brick red, old concrete gray) in the cross-section' },
  { file: 'clt', name: 'CLT', prompt: 'cross-laminated timber (CLT) panel, about 100mm thick, showing alternating wood grain layers in cross-section (3 or 5 layers visible), natural light pine wood color on surface' },
  { file: 'wood_fiber_insulation', name: '목섬유단열재', prompt: 'wood fiber insulation board, about 40mm thick, brown compressed wood fiber texture with dense fibrous structure, natural wood-brown color' },
  { file: 'cork_insulation', name: '코르크단열재', prompt: 'cork insulation board, about 30mm thick, natural brown cork texture with characteristic honeycomb-like cell pattern visible on surface and cross-section' },
  { file: 'cork_flooring', name: '코르크바닥', prompt: 'cork flooring tile, about 6mm thick, natural warm brown cork surface with distinctive cork grain pattern, smooth finished top surface' },
  { file: 'recycled_plastic_deck', name: '재활용플라스틱데크', prompt: 'recycled plastic decking board, about 25mm thick, dark brown wood-grain textured surface made from recycled plastic, solid core visible on cross-section with speckled recycled material pattern' },
  { file: 'natural_wood_deck', name: '천연목재데크', prompt: 'natural wood decking board, about 22mm thick, natural cedar/pine wood grain texture with warm honey-brown color, showing wood grain lines and small knots' },
  { file: 'solid_wood_flooring', name: '원목마루', prompt: 'solid hardwood flooring plank, about 18mm thick, rich medium brown oak wood grain with natural grain pattern, tongue and groove joint visible on cross-section edge' },
  { file: 'recycled_rubber', name: '재활용고무', prompt: 'recycled rubber flooring tile, about 10mm thick, dark black surface with visible multicolored rubber granule speckles (red, blue, green flecks) typical of recycled tire rubber material' },
  { file: 'straw_insulation_panel', name: '볏짚단열패널', prompt: 'compressed straw insulation panel, about 60mm thick, natural golden yellow straw texture with densely compressed straw stalks visible on surface and cross-section, organic appearance' },
  { file: 'engineered_wood_flooring', name: '강마루', prompt: 'Korean gangmaru (engineered laminate flooring with film), about 12mm thick, plywood base with decorative wood-grain printed film on top surface showing medium oak color, visible plywood layers on cross-section edge' },
  { file: 'treated_wood_subframe', name: '방부목 하지틀', prompt: 'pressure-treated lumber subframe piece, about 40x40mm square cross-section timber, greenish-brown treated wood color with visible wood grain and treatment chemical penetration marks' },
  { file: 'plywood', name: '합판', prompt: 'plywood panel, about 12mm thick, showing birch plywood with multiple thin veneer layers clearly visible on cross-section edge (about 7 layers), light natural wood surface' },
  { file: 'laminate_flooring', name: '강화마루', prompt: 'laminate flooring plank, about 8mm thick, HDF core with decorative wood-grain printed film on top showing light maple color, white HDF core visible on cross-section edge with click-lock profile' },
];

async function generateOne(mat) {
  const fullPrompt = `A single square panel of ${mat.prompt}. Lying flat at an isometric 3D angle. Pure white background. No shadows, no text, no labels. One piece only. Clean product catalog material swatch style.`;

  try {
    const res = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: fullPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'medium',
    });

    fs.writeFileSync(path.join(imagesDir, `${mat.file}.png`), Buffer.from(res.data[0].b64_json, 'base64'));
    console.log(`✅ ${mat.name} (${mat.file}) → saved`);
    return true;
  } catch (err) {
    console.error(`❌ ${mat.name} (${mat.file}) → ${err.message}`);
    return false;
  }
}

async function main() {
  let success = 0, fail = 0;
  for (let i = 0; i < materials.length; i++) {
    console.log(`[${i + 1}/${materials.length}] ${materials[i].name}...`);
    const ok = await generateOne(materials[i]);
    if (ok) success++; else fail++;
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log(`\nDone: ${success} generated, ${fail} failed`);
}

main();
