# 📁 J.codE M 폴더 구조 가이드

## 최종 폴더 구조

압축을 풀면 다음과 같은 구조가 되어야 합니다:

```
jcode-material/                  ← 프로젝트 루트 폴더
│
├── index.html                   ← 메인 페이지 (구조 선택)
├── material-selector.html       ← 자재 선택 페이지
├── assembly-comparison.html     ← 어셈블리 비교 페이지
├── server.js                    ← Express 서버 파일
├── package.json                 ← NPM 설정 파일
├── README.md                    ← 프로젝트 설명서
│
├── css/                         ← 스타일 폴더
│   └── common.css              ← 공통 CSS 파일
│
├── js/                          ← JavaScript 폴더
│   └── calculator.js           ← 탄소 계산 로직
│
├── data/                        ← 데이터 폴더
│   └── epd-korea.js            ← 국내 EPD 데이터
│
└── images/                      ← 이미지 폴더 (향후 사용)
```

## 🚀 설치 및 실행 단계별 가이드

### 1단계: ZIP 파일 다운로드
- `jcode-material.zip` 파일을 다운로드합니다

### 2단계: 압축 해제
- 원하는 위치에 압축을 풉니다
- 예: `C:\Projects\jcode-material\` (Windows)
- 예: `~/Projects/jcode-material/` (Mac/Linux)

### 3단계: 폴더 구조 확인
압축 해제 후 다음과 같은 구조인지 확인:

```
jcode-material/
├── index.html
├── material-selector.html
├── assembly-comparison.html
├── server.js
├── package.json
├── README.md
├── css/
│   └── common.css
├── js/
│   └── calculator.js
└── data/
    └── epd-korea.js
```

### 4단계: 터미널/명령 프롬프트 열기

**Windows:**
- 폴더에서 Shift + 우클릭 → "여기서 PowerShell 창 열기"
- 또는 cmd에서: `cd C:\Projects\jcode-material`

**Mac/Linux:**
- 터미널 열기
- `cd ~/Projects/jcode-material`

### 5단계: Node.js 설치 확인
```bash
node --version
npm --version
```

- 설치되어 있지 않으면: https://nodejs.org 에서 다운로드

### 6단계: 패키지 설치
```bash
npm install
```

이 명령어는 `package.json`에 정의된 의존성(express)을 설치합니다.

### 7단계: 서버 실행
```bash
npm start
```

또는

```bash
node server.js
```

### 8단계: 브라우저 접속
```
http://localhost:3000
```

## ⚠️ 주의사항

### 파일 위치가 중요한 이유:

1. **HTML 파일들은 루트에 있어야 합니다**
   - `index.html`
   - `material-selector.html`
   - `assembly-comparison.html`

2. **CSS는 css/ 폴더에**
   - HTML 파일에서 `<link rel="stylesheet" href="css/common.css">`로 참조

3. **JavaScript는 js/ 폴더에**
   - HTML 파일에서 `<script src="js/calculator.js"></script>`로 참조

4. **데이터는 data/ 폴더에**
   - HTML 파일에서 `<script src="data/epd-korea.js"></script>`로 참조

## 🔧 문제 해결

### 문제: CSS가 적용되지 않음
- `css/common.css` 파일이 올바른 위치에 있는지 확인
- 브라우저 개발자 도구(F12)에서 404 에러 확인

### 문제: JavaScript 오류
- `js/calculator.js`와 `data/epd-korea.js` 위치 확인
- 브라우저 콘솔(F12)에서 에러 메시지 확인

### 문제: 서버가 실행되지 않음
```bash
# Node.js 설치 확인
node --version

# 포트가 이미 사용 중인 경우
# server.js의 PORT를 3001 등으로 변경
```

### 문제: npm install 실패
```bash
# npm 캐시 클리어
npm cache clean --force

# 다시 설치
npm install
```

## 📝 파일별 역할

| 파일 | 역할 |
|------|------|
| `index.html` | 메인 페이지 - 4개 구조 선택 |
| `material-selector.html` | 자재 선택 및 레이어 구성 |
| `assembly-comparison.html` | 어셈블리 비교 및 분석 |
| `server.js` | Express 웹 서버 |
| `package.json` | 프로젝트 설정 및 의존성 |
| `css/common.css` | 전체 페이지 공통 스타일 |
| `js/calculator.js` | 탄소 배출량 계산 로직 |
| `data/epd-korea.js` | 국내 EPD 자재 데이터베이스 |

## 💡 개발 모드 실행 (선택사항)

파일 수정 시 자동 재시작하려면:

```bash
# nodemon 설치
npm install -g nodemon

# 개발 모드 실행
npm run dev
```

## 🌐 배포 시 주의사항

실제 서버에 배포할 때는:
1. 모든 파일과 폴더 구조 유지
2. `node_modules/` 폴더도 포함 (또는 서버에서 `npm install` 실행)
3. 포트 번호 환경에 맞게 설정
4. 방화벽 설정 확인

## ✅ 체크리스트

설치 전 확인:
- [ ] jcode-material.zip 다운로드 완료
- [ ] 압축 해제 완료
- [ ] 폴더 구조 확인
- [ ] Node.js 설치 확인 (`node --version`)
- [ ] 터미널에서 프로젝트 폴더로 이동
- [ ] `npm install` 실행
- [ ] `npm start` 실행
- [ ] 브라우저에서 http://localhost:3000 접속

---

**이 구조대로 파일이 배치되어 있어야 정상 작동합니다!**
