# JCODE Material - Handoff

## 현재 상태
- **버전**: 1.5.0
- **빌드**: 정상
- **서버**: `npm start` → http://localhost:3000
- **원본 DB**: `data/materials01.xlsx` (피라미드 슬롯 구조)
- **생성 JS**: `data/epd-korea.js` (convert-excel.js로 변환)

## 최근 작업

### 1. Floor 레벨별 GWP 재배정 + 렌더링 수정 (2026-04-29)
- floor 48개 자재를 GWP 기준으로 5개 레벨에 재배정
- 렌더링 코드 수정: 레벨별로 자재를 분리 배치 (기존: 순서대로 채움 → 레벨 혼재)
- GWP 음수값 뱃지에 마이너스 부호 표시 (기존 Math.abs 제거)

### 2. 자재 이미지 일괄 생성 (2026-04-29)
- GPT gpt-image-1 모델로 floor 자재 이미지 38개 생성
- 아이소메트릭 3D 패널 스타일, 흰 배경, 재료별 두께/질감 반영
- `images/` 폴더에 `{name_en}.png` 형식 저장

### 3. name_en 컬럼 채우기 (2026-04-29)
- 전 시트(floor/external/internal/ceiling/window) name_en 200개 항목 채움
- `scripts/fill-name-en.js` 스크립트 생성

## 주요 파일
```
css/common.css                 # 공통 스타일
data/materials01.xlsx          # 원본 DB (floor 48개, ext 83, int 83, ceiling 19, window 11)
data/epd-korea.js              # 생성 JS
data/floor_backup_original_83.xlsx  # floor 원본 83개 백업
data/epd-backup.js             # git HEAD 시점 epd-korea.js 백업
scripts/convert-excel.js       # 엑셀→JS 변환
scripts/fill-name-en.js        # name_en 자동 채우기
scripts/search-epd.js          # EPD 통합 검색 (EC3+2050)
scripts/generate-all-images.js # GPT 이미지 일괄 생성
scripts/reassign-levels.js     # GWP 기준 레벨 재배정
js/calculator.js               # 탄소 계산
material-selector.html         # 자재 선택 + 피라미드 + 3D
.env                           # OpenAI API 키 (gitignore됨)
```

## 명령어
```bash
npm start                                          # 서버
node scripts/convert-excel.js data/materials01.xlsx # 변환
node scripts/fill-name-en.js                       # name_en 채우기
node scripts/generate-all-images.js                # 이미지 생성
/epd MDF                                           # EPD 검색
```

## 알려진 이슈
- **floor 데이터 불일치**: 원본 83개 → 현재 48개 (revert 과정에서 축소). `floor_backup_original_83.xlsx`에 원본 보관
- **external/internal 슬롯 오버플로우**: GWP 기준 레벨 재배정 시 Level 1/3 슬롯 초과. 현재 기존 레벨 유지
- EC3 API 차단 → 로컬 DB만 사용
- 2050 Materials access token 24시간 만료 → 자동 재발급
- 천장 3D 모델: 일부 자재(타일형)가 경량철골천장틀 면 전체를 안 덮는 문제
- 비교 페이지 천장/창호 3D 프리뷰 모바일 화면 잘림 가능성

## TODO
- [ ] floor 원본 83개 복원 + 레벨 재배정 (슬롯 확장 필요)
- [ ] external/internal 레벨별 재배정 (슬롯 수 조정 필요)
- [ ] 천장 3D 타일형 자재 면적 커버리지 수정
- [ ] 자재 이미지 추가 (external/internal/ceiling/window)
- [ ] 강마루/강화마루/방부목하지틀 GWP 값 확정 입력
- [ ] EPD 출처 표기 정리 (EC3 플랫폼 vs EPD 발행기관)
