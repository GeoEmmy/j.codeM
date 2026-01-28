# J.codE M - 건축 탄소배출량 평가 시스템

**JUNGLIM Carbon-oriented design Evaluation - Material**

국내 EPD(환경성적표지) 데이터를 기반으로 건축 자재의 탄소배출량을 계산하고 비교하는 웹 기반 평가 시스템입니다.

## 🌟 주요 기능

### 1. 구조별 자재 선택
- **바닥 구조** (Floor)
- **외벽 구조** (External Wall)  
- **내벽 구조** (Internal Wall)
- **지붕 구조** (Roof)

각 구조에 맞는 국내 EPD 자재 데이터베이스를 제공합니다.

### 2. 실시간 탄소 계산
- 레이어별 탄소배출량 계산
- 두께 및 면적을 고려한 정확한 산정
- 총 배출량 및 단위면적당 배출량 표시

### 3. 어셈블리 비교
- 여러 자재 조합(어셈블리) 저장
- 시각적 차트를 통한 비교 분석
- 탄소 등급 (A+++ ~ D) 평가

### 4. 데이터 관리
- LocalStorage 기반 데이터 저장
- CSV 형식 데이터 내보내기
- 상세 분석 및 통계

## 📂 프로젝트 구조

```
jcode-material/
├── index.html                    # 메인 페이지 (구조 선택)
├── material-selector.html        # 자재 선택 페이지
├── assembly-comparison.html      # 어셈블리 비교 페이지
├── server.js                     # Express 서버
├── css/
│   └── common.css               # 공통 스타일
├── js/
│   └── calculator.js            # 탄소 계산 로직
├── data/
│   └── epd-korea.js            # 국내 EPD 데이터
└── README.md
```

## 🚀 설치 및 실행

### 1. Node.js 설치
Node.js 14 이상이 필요합니다.

### 2. 의존성 설치
```bash
npm install express
```

### 3. 서버 실행
```bash
node server.js
```

### 4. 브라우저 접속
```
http://localhost:3000
```

## 📊 EPD 데이터

### 데이터 출처
한국환경산업기술원 (KEITI) EPD 인증 데이터 기반

### 포함된 자재 카테고리
- **구조재**: 콘크리트, 철골, 블록, 벽돌 등
- **단열재**: XPS, EPS, 유리면, 암면 등
- **방수층**: 아스팔트, 우레탄 방수 등
- **마감재**: 석고보드, 타일, 페인트 등
- **외장재**: 벽돌, 화강석, 금속패널 등
- **지붕재**: 기와, 강판, 방수시트 등

### 환경 영향 지표
- **GWP** (Global Warming Potential): 지구온난화지수
- 단위: kg CO₂eq/m³

## 💡 사용 방법

### 1. 구조 타입 선택
메인 페이지에서 평가하고자 하는 구조(바닥/외벽/내벽/지붕)를 선택합니다.

### 2. 자재 레이어 구성
- 자재 카드를 클릭하여 레이어 추가
- 각 레이어의 두께(mm) 입력
- 실시간으로 탄소배출량 확인

### 3. 어셈블리 저장
- 어셈블리 이름 지정
- 적용 면적 입력 (m²)
- 저장 버튼 클릭

### 4. 비교 및 분석
- 어셈블리 비교 페이지에서 저장된 조합들을 비교
- 차트를 통한 시각적 분석
- CSV로 데이터 내보내기

## 🎨 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express
- **3D Visualization**: Three.js
- **Data Storage**: LocalStorage (브라우저)
- **Styling**: Custom CSS with Google Fonts (Poppins)

## 📈 탄소 등급 기준

| 등급 | 탄소배출량 (kg CO₂eq/m²) |
|------|-------------------------|
| A+++ | < 50                    |
| A++  | 50 ~ 100               |
| A+   | 100 ~ 150              |
| A    | 150 ~ 200              |
| B    | 200 ~ 250              |
| C    | 250 ~ 300              |
| D    | > 300                  |

## 🔧 커스터마이징

### 자재 데이터 추가
`data/epd-korea.js` 파일에서 자재를 추가할 수 있습니다:

```javascript
{
  id: 'material_id',
  name: '자재명',
  nameEn: 'Material Name',
  category: 'structural',
  categoryName: '구조재',
  gwp: 315,  // kg CO₂eq/m³
  unit: 'kg CO2eq/m³',
  density: 2400,  // kg/m³
  color: '#636e72',
  source: '한국환경산업기술원',
  description: '설명'
}
```

## 🌐 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 📝 라이선스

이 프로젝트는 JUNGLIM의 내부 사용을 위해 개발되었습니다.

## 👥 개발

- **기획**: JUNGLIM
- **개발**: J.codE M Team
- **데이터**: 한국환경산업기술원 EPD

## 📞 문의

프로젝트 관련 문의사항이 있으시면 JUNGLIM로 연락주시기 바랍니다.

---

**J.codE M** - Making Architecture Sustainable 🌱
