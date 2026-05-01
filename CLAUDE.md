# JCODE Material - Claude 설정

## 기술 스택
- Node.js + Express
- Vanilla HTML/CSS/JS
- Three.js (3D 프리뷰)
- ExcelJS (엑셀 처리)

## 작업 인수인계 규칙

### 세션 시작 시 (필수)
- `handoff.md` 파일이 있으면 **반드시 먼저 읽기**
- 현재 상태와 TODO 파악 후 작업 시작

### 세션 종료 시 (필수)
작업 완료 시 **자동으로** handoff.md 업데이트:
- 현재 상태 갱신
- 최근 작업 요약 (1-2개만 유지)
- 알려진 이슈 업데이트
- TODO 업데이트

**주의:**
- "업데이트할까요?" 질문 금지
- 사용자 요청까지 대기 금지
- 자동으로 업데이트

### handoff.md 구조 (200줄 이하)
```
# 현재 상태
# 최근 작업 (1-2개)
# 주요 파일
# 명령어
# 알려진 이슈
# TODO
```

### CHANGELOG.md
- 과거 히스토리는 여기에 누적
- 날짜별 변경 이력
- 의사결정 배경 기록

## 주요 명령어
```bash
npm start           # 서버 시작 (포트 3000)
npm run db:convert  # 엑셀 → JS 변환
npm run db:template # 엑셀 템플릿 생성
```

## 파일 구조
```
data/
├── materials.xlsx    # 자재 DB (편집용)
└── epd-korea.js      # 생성된 JS

scripts/
├── convert-excel.js  # 엑셀 변환 (이미지 추출)
└── import-epd.js     # EPD 데이터 임포트

images/materials/     # 자재 이미지
```

## 코딩 규칙
- 한글 주석 사용
- console.log 금지 (디버깅 후 제거)
- 함수명: camelCase
- 파일명: kebab-case
