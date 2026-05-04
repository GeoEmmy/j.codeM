# JCODE Material - Handoff

## 현재 상태
- **버전**: 1.7.0
- **빌드**: 정상
- **서버**: `npm start` → http://localhost:3000
- **원본 DB**: `data/materials01.xlsx` (피라미드 슬롯 구조)
- **생성 JS**: `data/epd-korea.js` (convert-excel.js로 변환)
- **자재 수**: floor 47, external 62, internal 54, ceiling 19, window 11

## 최근 작업

### 1. 어셈블리 비교 페이지 3D 모델 통합 (2026-05-04)
- material-selector에서 `group3D.toJSON()`으로 3D 모델을 localStorage에 저장
- assembly-comparison에서 `THREE.ObjectLoader.parse()`로 복원
- 카메라 궤도 회전 방식으로 두 페이지 통일 (group3D.rotation → 카메라 회전)
- 어셈블리 비교 페이지에 드래그 회전 + 스크롤 줌 + 호버 explode 추가
- 저장 시 회전/explode 리셋하여 기본 각도로 저장

### 2. 내벽 3D 모델 + 자재 물성/텍스처 (2026-05-03~04)
- 내벽 전용 자재 17개 물성/색상 추가
- 스틸스터드/목재스터드 C채널 수직 프레임 3D 구현
- 단열재 studfill 패턴 (스터드 사이 충진, 순서 무관 매칭)
- 폴리우레탄흡음재 에그크레이트 반구 돌기 3D
- 규산칼슘보드 alphaMap 타공, 흡음패널 세로슬릿, 사이딩 사다리꼴 단면
- 외벽 적층 우→좌 + 자재별 모듈 분할 (brick/tile/siding/stone 등 13패턴)
- ICE v3 출처 → EC3/OBD 전환 (28건), EPiC/ICE 레전드 제거
- 피라미드 슬롯 외벽/내벽 통일, 바닥 레벨 행수 조정
- 내벽/외벽 이미지 생성 (GPT-4o image)

## 주요 파일
```
css/common.css                 # 공통 스타일
data/materials01.xlsx          # 원본 DB
data/epd-korea.js              # 생성 JS
scripts/convert-excel.js       # 엑셀→JS 변환
scripts/search-epd.js          # EPD 통합 검색 (EC3+Ökobaudat+2050)
scripts/image-prompts.js       # 자재 이미지 프롬프트 (외벽 35개)
scripts/generate-all-images.js # GPT 이미지 일괄 생성
scripts/generate-images.js     # 누락 이미지 자동 생성
js/calculator.js               # 탄소 계산 + 어셈블리 저장
material-selector.html         # 자재 선택 + 피라미드 + 3D
assembly-comparison.html       # 어셈블리 비교 (3D 복원)
index.html                     # 메인 페이지
favicon.svg                    # 파비콘 (피라미드형)
.env                           # OpenAI API 키 (gitignore됨)
```

## 명령어
```bash
npm start                                          # 서버
node scripts/convert-excel.js data/materials01.xlsx # 변환
node scripts/search-epd.js ETFE                    # EPD 검색 (전체)
node scripts/search-epd.js OSB --obd               # Ökobaudat만
/epd MDF                                           # EPD 검색 (스킬)
```

## 알려진 이슈
- 스터드+단열재 순서에 따라 explode 시 위치가 약간 어긋날 수 있음
- 어셈블리 3D JSON localStorage 크기 제한 (어셈블리 10개 이상 시 5MB 초과 가능)
- 천장 3D 모델: 일부 자재(타일형)가 경량철골천장틀 면 전체를 안 덮는 문제
- EC3 API 차단 → 로컬 DB만 사용
- 2050 Materials access token 24시간 만료 → 자동 재발급

## TODO
- [ ] 내벽 자재 이미지 미생성분 보완
- [ ] floor 원본 83개 복원 + 레벨 재배정
- [ ] 천장 3D 타일형 자재 면적 커버리지 수정
- [ ] Hempcrete GWP 값 문헌 기반 확정 입력
- [ ] 외벽 3D 디테일 강화 (프로시저럴 텍스처 확대 적용)
- [ ] 어셈블리 3D JSON 용량 최적화 (geometry 압축)
- [ ] 창호 3D 모델 개선
