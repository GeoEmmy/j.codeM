# JCODE Material - Changelog

## 2026-05-04

### 어셈블리 비교 페이지 3D 모델 통합
- material-selector에서 `group3D.toJSON()`으로 3D 씬을 localStorage에 저장
- assembly-comparison에서 `THREE.ObjectLoader.parse()`로 복원 → 동일 3D 모델 표시
- 저장 시 회전/explode 상태 리셋하여 기본 각도로 저장
- 어셈블리 삭제 시 3D JSON도 함께 정리

### 카메라 회전 방식 통일
- group3D.rotation 방식 → 카메라 궤도 회전 방식으로 두 페이지 통일
- 드래그 회전 + 자동 회전 + 스크롤 줌 + 호버 explode (두 페이지 동일)
- 마우스 드래그 방향 포인터 방향과 일치하도록 수정

## 2026-05-03

### 내벽 3D 모델 + 자재 물성/텍스처
- 내벽 전용 자재 17개 물성/색상 추가 (벽지, 석고보드, 규산칼슘 등)
- 스틸스터드/목재스터드 C채널 수직 프레임 3D 구현
- 단열재 studfill 패턴: 스터드 사이 충진, 보강채널 상하 분리
- 스터드+단열재 순서 무관 일대일 매칭 + explode 시 그룹 유지
- 규산칼슘보드 alphaMap 타공, 흡음패널 세로슬릿 텍스처
- 폴리우레탄흡음재 에그크레이트 반구 돌기 3D
- 사이딩 사다리꼴 단면 (두꺼운쪽 하단)
- 미네랄울샌드위치패널 3층 구조 (아이보리 강판+황토단열재+강판, 세로매지)
- 대나무구조재/보드/목모보드/파티클보드/OSB 프로시저럴 텍스처
- ALC블록 alc→alc_internal 정확매칭 (calcium_silicate 충돌 해결)
- 포세린타일 stone 패턴, 코르크패널 panel 패턴, 석고보드/파티클보드/흡음패널 solid

### EPD 출처 수정
- ICE v3 출처 28건 → EC3/OBD로 전환 (실제 EPD 제품명 명시)
- 재활용알루미늄: 13,068→2,660 kgCO2e/m³ (Hydro Low Carbon Recycled)
- 천장 재활용알루미늄: 2.87→5.93 kgCO2e/m² (Hydro Low Carbon 3.66×1.62)
- 레전드에서 ICE v3, EPiC 제거
- 엑셀 헴프단열재 중복 삭제

### 피라미드 슬롯 통일
- 외벽/내벽 피라미드 슬롯/레벨 공통화 (11행)
- 바닥 L1=2행, L4=2행, L5=2행 변경
- 내벽 엑셀 레벨값 문자열→숫자 변환
- 전 시트 빈 슬롯=빈 행으로 레벨별 배치

### 이미지 생성
- 내벽 이미지 6개 생성 (스틸스터드, 규산칼슘보드, 파티클보드, 석고미장, 폴리우레탄흡음재, 대나무보드)
- 목재스터드/목재틀 이미지 분리 생성

### 기타
- index.html 천장 석고보드 두께 반감
- 외벽에 목재스터드 추가

## 2026-05-01 (후반)

### 외벽 3D 적층 방향 우→좌 변경
- 레이어 적층을 좌→우에서 **우→좌**로 변경 (외부마감 +X → 내부 -X)
- `pos`를 `wallTotalThickness`에서 시작, 각 레이어마다 `pos -= thickness`
- centering 로직: `wallTotalThickness` 기준 중심 계산
- explode 애니메이션: 외벽 방향 `-1`로 통일 (animate3D + save3DImage 모두)

### 철재하지틀/목재틀 각파이프 3D 구현
- 모든 부재를 각파이프(속이 빈 사각관) 4면 판으로 렌더링
- `addPipe(cx,cy,cz,w,h,len,axis)` 헬퍼: X/Y/Z 방향 각파이프 생성
- 바닥: 다리(Y방향) + 단변 3등분 장방형 그리드 (X/Z 방향 바)
- 벽체: 바닥 격자를 세워서 사용 — 다리(X방향, 벽면→바깥) + YZ평면 격자
- `wallTotalThickness` 계산에서 프레임 실제 소모량(legDepth+pipeH) 별도 반영

### 개발 도구 설치
- OpenAI Codex CLI v0.128.0 (`npm i -g @openai/codex`)
- Google Gemini CLI v0.40.1 (`npm i -g @google/gemini-cli`)
- Claude Octopus 플러그인 (멀티 AI 오케스트레이터)

---

## 2026-05-01

### 외벽 피라미드 레벨별 슬롯 재구성
- 외벽 피라미드를 5레벨 11행으로 재구성 (L1:6, L2:10, L3:25, L4:12, L5:32)
- 레벨 구분 라벨 가운데 배치 + 양옆 구분선 추가
- 카테고리 필터 시 슬롯 위치 고정 (전체 자재 기준 배치, 필터 비대상만 숨김)
- 구분선 항상 고정 위치 유지 (천장/창호 포함 전 타입)
- 바닥 Level 1 구분선 간격/길이 축소

### EPD 검색에 Ökobaudat 연동
- Ökobaudat 로컬 DB(2,334개, A1-A3 모듈) 추가
- 검색 결과 전체 kgCO₂e/m³ 통일 변환 출력
- 밀도/두께 없는 자재 추정값 자동 적용 (50+ 키워드 패턴)
- 사용법: `/epd OSB --obd` (Ökobaudat만), `/epd MDF` (전체)

### 외벽 자재 이미지 35개 생성
- GPT gpt-image-1 모델로 외벽 자재 이미지 35개 생성
- 600×600mm 기준 45도 뷰, 두께 비율 반영
- 벽돌/블록류는 실제 규격 (190×90×57mm, 300×400×600mm)

### 외벽 3D 모델 자재별 패턴 적용
- 벽돌쌓기 (러닝본드): 벽돌, ALC, 흙벽돌, 대마콘크리트
- 타일 그리드: 세라믹, 점토타일, 모자이크
- 사이딩 (가로줄): 비닐사이딩, 테라코타
- 석재 패널: 대리석, 화강석, 샌드스톤, 라임스톤
- 커튼월 패널: HPL, GRC, UHPC, 폴리카보네이트
- 목재 세로 널빤지: 목재사이딩, 합판, CLT, OSB
- 금속 시트: 알루미늄, 동판, 아연판, 강판
- 도포형: 미장, 페인트, 모르타르

### 기타
- 파비콘 추가 (피라미드형 5단계 그라데이션)
- 페이지 제목 J.codE M을 맨 앞으로 이동
- 천장 capture separated explode 방향 수정
- 외벽 자재 두께 빈값 6개 채움 (시멘트판넬12mm, 섬유시멘트8mm, 테라코타30mm, ALC200mm, 샌드스톤30mm, 라임스톤30mm)

---

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
