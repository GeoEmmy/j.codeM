# JCODE Material - Changelog

## 2026-04-29

### Floor 레벨별 GWP 재배정 + 피라미드 렌더링 수정
**목적**: 자재를 GWP 값 기준으로 올바른 레벨 슬롯에 배치

**변경 사항**:
- `scripts/reassign-levels.js`: GWP 기준 레벨 자동 재배정 (≥10000/≥1000/≥100/≥0/<0)
- `material-selector.html`: 렌더링 로직 수정 — 자재를 레벨별로 분류 후 해당 레벨 슬롯에만 배치 (기존: 순서대로 채움 → 레벨 혼재 문제)
- GWP 뱃지 음수 표시 수정 (Math.abs 제거 → -887, -693 등 마이너스 표시)

### name_en 컬럼 전체 채우기
**변경 사항**:
- `scripts/fill-name-en.js`: 한국어→영어 번역 매핑 200개
- floor/external/internal/ceiling/window 전 시트 name_en 100% 채움

### 자재 이미지 일괄 생성 (GPT gpt-image-1)
**변경 사항**:
- `scripts/generate-all-images.js`: GPT gpt-image-1 모델로 자재 이미지 생성
- floor 자재 38개 이미지 생성 (아이소메트릭 3D 패널, 흰 배경, 재료별 두께/질감)
- `images/{name_en}.png` 형식 저장
- 비용: 약 $2.5 (DALL-E 3 22장 + gpt-image-1 38장)

### EPD 검색 및 분석
**검색 자재**: 천연목재데크, 재활용고무바닥재, 강마루, 강화마루, 재활용플라스틱데크, 각목, 볏짚단열패널, 셀룰로오스단열재, 재활용골재콘크리트
**m³ 환산 결과**:
- 셀룰로오스단열재: 0.389/m² → 3.89/m³ (EC3, 밀도 50)
- 재활용골재콘크리트: 1.8/t → 3.96/m³ (EC3, 밀도 2200)
- 재활용플라스틱데크: 17.8/m² → 757/m³ (EC3 Fiberon, 밀도 1050)
- 재활용고무바닥재: 13.1/m² → 1638/m³ (EC3 Dropzone 8mm, 밀도 1250)
- 볏짚단열패널: -88.7/m² → -222/m³ (EC3 EcoCocon, 밀도 110)
- 강마루: 정확한 EPD 없음 (합판+필름 → 조합 추정 -400/m³)
- 강화마루: -5.37/m² → -565/m³ (EC3 Laminate flooring, HDF코어)

### 기타
- `.env` 파일 생성 (OpenAI API 키), `.gitignore`에 추가
- `data/floor_backup_original_83.xlsx`: floor 원본 83개 백업
- openai npm 패키지 설치

---

## 2026-04-21~22

### DB 구조 전면 개편 (피라미드 슬롯 시스템)
**목적**: 피라미드 83슬롯에 맞춰 엑셀 DB 구조 재설계

**변경 사항**:
- `data/materials01.xlsx`: no/level/name 기반 구조, id 컬럼 불필요
- 바닥/외벽/내벽: Level 1~5 그룹 (m³ 단위, GWP 임계값 기준)
- 천장/창호: 순서대로 배치 (m² 단위, Level 그룹 없음)
- 빈슬롯은 no+level만 존재

### m² 단위 자재 지원
**목적**: 천장/창호는 m² 단위가 적합

**변경 사항**:
- `js/calculator.js`: unit에 m²/m2 포함 시 `GWP × 면적`, 아니면 `GWP × 부피`
- `material-selector.html`: m² 자재는 두께 입력 숨기고 "면적 단위 (m²)" 표시
- 피라미드: 천장/창호는 순서대로 배치, 바닥/외벽/내벽은 Level 그룹 유지
- 카테고리 필터: 창호=전체만, 천장=전체/구조재/마감재

### 천장 EPD 데이터 추가
**데이터**:
- 흡음텍스: 2.58 kgCO2e/m² (마이텍스12T, 집텍스9.5T, 집텍스에코9.5T 평균 3개)
- 석고보드: 1.35 kgCO2e/m² (KCC/크나우프/자이천연 9.5T 평균 8개)
- 석고텍스: 1.44 kgCO2e/m² (KCC석고텍스PLUS, 벽산석고텍스, box→m² 환산 3.24m²/box)
- 경량철골천장틀: 5.88 kgCO2e/m² (ICE v3 galvanized steel 2.76 kgCO2e/kg × 자중 2.13 kg/m²)
- 금속천장(버진): 18.39 kgCO2e/m² (ICE v3 aluminium virgin 11.35 × 1.62 kg/m²)
- 금속천장(재활용): 2.87 kgCO2e/m² (ICE v3 aluminium recycled 1.77 × 1.62 kg/m²)

**출처 검증**:
- ICE v3 galvanized steel: 2.76 kgCO2e/kg (Climatiq, Circular Ecology)
- ICE v3 aluminium sheet worldwide: 1.851 kgCO2e/kg (Climatiq, 재활용 31%)
- ICE v3 aluminium virgin: 11.35, recycled: 1.77 (AutoCalcs)
- 천장틀 자중: 한국물가정보 T-Bar형 소요량 기준 계산

### 창호 데이터 재구성
**변경**: 프레임/유리 분리 → 프레임+유리 세트로 통합
**데이터**:
- 목재/PVC/알루미늄+복층/삼중유리 (BCIS 출처)
- 스틸+복층유리: 127, 스틸+삼중유리: 169 kgCO2e/m² (ScienceDirect 2020)
- 강화유리, 접합유리 (okobaudat)
- 3D 모델: 프레임+유리 세트는 프레임 표시, 접합/강화유리는 포인트 피팅만

### 자재 이미지 추출
- Excel 365 "셀에 이미지 배치" → richData 형식 → ExcelJS 미지원
- 워크북 media 순서로 매핑하여 추출 (정확도 의존)

### C:/db/db.csv 병합 (CSV 단계)
- 54개 자재 추가 (okobaudat, 국가LCIDB, 환경성적표지, 2050materials 등)
- 단위 변환: kg→m³(밀도 곱), ton→m³, box→m², m 단위 제외
- 구조체 자동 분류: 바닥24/외벽16/창호10/내벽4
- 콘크리트/철근/형강: 바닥+외벽+내벽 공통 배치
- 주의: CSV에만 반영, 엑셀 미반영 상태

---

## 2026-02-04

### 엑셀 이미지 자동 추출 기능
**목적**: 개발자가 엑셀에 이미지를 직접 삽입하면 자동 추출

**변경 사항**:
- `package.json`: exceljs 패키지 추가
- `scripts/convert-excel.js`: xlsx → exceljs로 변경, 이미지 추출 로직 추가
- `material-selector.html`: getMaterialImageUrl()에 image 필드 우선 체크 추가

**사용법**:
1. 엑셀 자재 행 우측에 이미지 삽입
2. `npm run db:convert` 실행
3. `images/materials/`에 이미지 자동 저장

---

### EPD 단위 통일 (m³)
**목적**: 모든 자재 단위를 kgCO2e/m³로 통일

**변경 사항**:
- `scripts/import-epd.js`: normalizeToM3() 함수 추가
- m² → ×100 (두께 10mm 가정)
- kg → ×밀도
- ton → ×밀도/1000
- 개/box/포대 → 제외 (변환 불가)

**결과**: 162개 자재 (변환 불가 17개 제외)

---

### EPD + ICE 데이터 병합
**목적**: 한국 EPD 데이터에 해외 ICE Database 보충

**변경 사항**:
- `scripts/import-epd.js` 생성
- 한국 EPD 파일 파싱 + 분류
- ICE v3 데이터 58개 추가
- 자재명 10자 이내로 단축

**분류 기준**:
- floor: 콘크리트, 바닥, 타일, 단열재
- external: 벽돌, 외벽, 패널, 석재
- internal: 석고보드, 내벽, 파티션
- ceiling: 천장, 텍스, 흡음
- window: 유리, 창호, 프레임

---

### 엑셀 → JS 변환 시스템
**목적**: 개발자가 엑셀로 DB 관리, 빌드 시 JS로 변환

**변경 사항**:
- `scripts/convert-excel.js` 생성
- `npm run db:convert` 명령어 추가
- `npm run db:template` 템플릿 생성 명령어

**의사결정 배경**:
- 사용자: "개발자인 내가 편하게 db를 업로드하는 용도"
- 런타임 엑셀 로딩 대신 빌드 타임 변환 선택 (속도 우선)

---

## 이전 커밋 히스토리 (git log)

- `90e4730` EPD 엑셀 변환 시스템 추가 및 단위 m³ 통일
- `7d96c0a` 바차트의 바 가운데 정렬 및 폭 조정, 색깔 다르게 지정
- `4ab2f00` 바 크기 조정
- `168cd83` 그래프 부재별로 분리
- `9fb71ce` 헤더 버튼 위치 통일
- `2c6cd53` 어셈블리 비교 페이지 스크롤링 변경 및 메인으로 버튼
