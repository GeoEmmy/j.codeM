const XLSX = require('xlsx');
const path = require('path');

const wb = XLSX.readFile(path.join(__dirname, '..', 'data', 'materials01.xlsx'));

const translations = {
  // floor
  '고무바닥재': 'rubber_flooring',
  '이중바닥재': 'raised_access_floor',
  '포세린타일': 'porcelain_tile',
  '비닐시트': 'vinyl_sheet',
  '액체방수': 'liquid_waterproofing',
  'PVC타일': 'pvc_tile',
  '세라믹타일': 'ceramic_tile',
  '진공단열재': 'vacuum_insulation_panel',
  '저탄소 콘크리트': 'low_carbon_concrete',
  '시멘트모르타르': 'cement_mortar',
  'XPS': 'xps',
  '합성목재데크': 'composite_wood_deck',
  '화강석': 'granite',
  '대리석': 'marble',
  '경질우레탄폼': 'rigid_urethane_foam',
  '카펫타일': 'carpet_tile',
  '팽창퍼라이트': 'expanded_perlite',
  '암면': 'rock_wool',
  'EPS': 'eps',
  '그라스울보온판': 'glass_wool_board',
  'PF보드': 'phenolic_foam_board',
  '바이오폴리우레탄바닥재': 'bio_polyurethane_flooring',
  '대나무구조재': 'bamboo_structural',
  '헴프단열재': 'hemp_insulation',
  '양모단열재': 'wool_insulation',
  '재활용골재콘크리트': 'recycled_aggregate_concrete',
  'clt': 'clt',
  '코르크바닥': 'cork_flooring',
  '재활용플라스틱데크': 'recycled_plastic_deck',
  '천연목재데크': 'natural_wood_deck',
  '원목마루': 'solid_wood_flooring',
  '재활용고무': 'recycled_rubber',
  '볏짚단열패널': 'straw_insulation_panel',
  '강마루': 'engineered_wood_flooring',
  '방부목 하지틀': 'treated_wood_subframe',
  '강화마루': 'laminate_flooring',
  // external
  '알루미늄커튼월': 'aluminum_curtain_wall',
  '동판': 'copper_plate',
  '아연알루미늄합금판': 'zinc_aluminum_alloy_plate',
  '아연판': 'zinc_plate',
  '알루미늄판': 'aluminum_plate',
  '구리판': 'copper_plate',
  '징크': 'zinc_cladding',
  '에나멜스틸': 'enamel_steel',
  '코르텐강': 'corten_steel',
  '칼라강판': 'color_steel_sheet',
  '스틸사이딩': 'steel_siding',
  '알루미늄복합패널': 'aluminum_composite_panel',
  'ETFE': 'etfe',
  '폴리카보네이트': 'polycarbonate',
  '재생알루미늄': 'recycled_aluminum',
  '유리커튼월': 'glass_curtain_wall',
  '유리블록': 'glass_block',
  '일반형 베이스패널': 'standard_base_panel',
  '아크릴패널': 'acrylic_panel',
  '고무방수시트': 'rubber_waterproof_sheet',
  '석재커튼월': 'stone_curtain_wall',
  '비닐사이딩': 'vinyl_siding',
  'UHPC패널': 'uhpc_panel',
  'GRC패널': 'grc_panel',
  '페놀수지패널': 'phenolic_resin_panel',
  'HPL패널': 'hpl_panel',
  '섬유시멘트': 'fiber_cement',
  '세라믹패널': 'ceramic_panel',
  '점토타일': 'clay_tile',
  '테라코타': 'terracotta',
  '시멘트보드': 'cement_board',
  '섬유시멘트사이딩': 'fiber_cement_siding',
  '벽돌': 'brick',
  '천연석클래딩': 'natural_stone_cladding',
  '점토벽돌': 'clay_brick',
  '규산칼슘보드': 'calcium_silicate_board',
  '화강암': 'granite',
  '모르타르마감': 'mortar_finish',
  'ALC i': 'alc_internal',
  '경량콘크리트블록': 'lightweight_concrete_block',
  '재활용유리타일': 'recycled_glass_tile',
  '유리모자이크타일': 'glass_mosaic_tile',
  '점토미장': 'clay_plaster',
  '사암': 'sandstone',
  'UBC 알루미늄캔': 'ubc_recycled_aluminum',
  'PUR외단열': 'pur_external_insulation',
  'ALC블록': 'alc_block',
  '석고보드': 'gypsum_board',
  'XPS외단열': 'xps_external_insulation',
  '석회암': 'limestone',
  'EPS외단열': 'eps_external_insulation',
  '재활용벽돌': 'recycled_brick',
  '팽창질석': 'expanded_vermiculite',
  '미네랄울외단열': 'mineral_wool_external_insulation',
  '재활용콘크리트패널': 'recycled_concrete_panel',
  '석회칠': 'limewash',
  '석회미장': 'lime_plaster',
  '셀룰로오스단열': 'cellulose_insulation',
  '재생벽돌': 'reclaimed_brick',
  '셀룰로오스뿜칠': 'cellulose_spray_insulation',
  '흙벽돌': 'earth_brick',
  '목섬유단열': 'wood_fiber_insulation',
  '헴프단열': 'hemp_insulation',
  '볏짚단열': 'straw_insulation',
  '바이오차벽돌': 'biochar_brick',
  '코르크패널': 'cork_panel',
  '코르크단열': 'cork_insulation',
  '저탄소콘크리트패널': 'low_carbon_concrete_panel',
  '짚벽': 'straw_wall',
  '대나무패널': 'bamboo_panel',
  '대나무보드': 'bamboo_board',
  '목재사이딩': 'wood_siding',
  '녹화시스템': 'green_wall_system',
  '삼나무판': 'cedar_board',
  '적삼목판': 'western_red_cedar_board',
  '집성목외벽': 'glulam_exterior',
  // internal
  '스테인리스스틸': 'stainless_steel',
  '용융아연도금철판': 'hot_dip_galvanized_steel',
  '스틸스터드': 'steel_stud',
  '알루미늄쉬트': 'aluminum_sheet',
  '에폭시바닥': 'epoxy_flooring',
  '우레탄바닥': 'urethane_flooring',
  '천연벽지': 'natural_wallpaper',
  '고무타일': 'rubber_tile',
  '재활용알루미늄쉬트': 'recycled_aluminum_sheet',
  '아연': 'zinc',
  '아크릴시트': 'acrylic_sheet',
  '인조석': 'artificial_stone',
  '비닐바닥재': 'vinyl_flooring',
  '페인트': 'paint',
  '벽지': 'wallpaper',
  '도기질타일': 'ceramic_wall_tile',
  '테라조': 'terrazzo',
  '콘크리트': 'concrete',
  '시멘트판넬': 'cement_panel',
  'OSB': 'osb',
  '파티클보드': 'particle_board',
  '코르크단열재': 'cork_insulation',
  '흡음패널': 'acoustic_panel',
  '시멘트미장': 'cement_plaster',
  '목재스터드': 'wood_stud',
  '콘크리트블럭': 'concrete_block',
  '석고미장': 'gypsum_plaster',
  '라임스톤': 'limestone',
  '폴리우레탄흡음재': 'polyurethane_acoustic',
  '콘크리트벽돌': 'concrete_brick',
  '목섬유단열재': 'wood_fiber_insulation',
  '그라스울': 'glass_wool',
  '재활용콘크리트': 'recycled_concrete',
  '재사용벽돌': 'reused_brick',
  '헴프크리트': 'hempcrete',
  '천연고무바닥': 'natural_rubber_flooring',
  'MDF': 'mdf',
  '에코보드': 'eco_board',
  '대나무마루': 'bamboo_flooring',
  '리놀륨': 'linoleum',
  '목모보드': 'wood_wool_board',
  '천연리놀륨': 'natural_linoleum',
  '집성목': 'glulam',
  'LVL': 'lvl',
  'CLT': 'clt',
  '합판': 'plywood',
  '셀룰로오스단열재': 'cellulose_insulation',
  '티타늄판': 'titanium_plate',
  // ceiling
  '경량목재천장틀': 'wood_ceiling_frame',
};

const sheets = ['floor', 'external', 'internal', 'ceiling', 'window'];
let totalFilled = 0;
let notFound = [];

sheets.forEach(s => {
  const ws = wb.Sheets[s];
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let r = 1; r <= range.e.r; r++) {
    const nameCell = ws[XLSX.utils.encode_cell({r, c:2})];
    const enCell = ws[XLSX.utils.encode_cell({r, c:3})];
    const name = nameCell ? String(nameCell.v).trim() : '';
    const en = enCell ? String(enCell.v).trim() : '';
    if (name && !en) {
      const translated = translations[name];
      if (translated) {
        ws[XLSX.utils.encode_cell({r, c:3})] = {t:'s', v: translated};
        totalFilled++;
      } else {
        notFound.push(s + ':Row' + (r+1) + ':' + name);
      }
    }
  }
});

XLSX.writeFile(wb, path.join(__dirname, '..', 'data', 'materials01.xlsx'));
console.log('Filled:', totalFilled, 'entries');
if (notFound.length > 0) {
  console.log('Not found:', notFound.length);
  notFound.forEach(n => console.log('  ' + n));
}
