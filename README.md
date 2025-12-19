# 📰 NewsAI Frontend

**NewsAI Frontend**는 AI가 요약한 최신 뉴스를 실시간으로 제공하는 웹 애플리케이션입니다.
React와 TypeScript로 구축되었으며, 사용자 편의를 위한 다크 모드, TTS(음성 듣기), 키워드 트렌드 분석 등의 다양한 인터랙티브 기능을 제공합니다.

## ✨ 주요 기능 (Key Features)

* **📰 실시간 뉴스 피드**: 5초마다 자동으로 최신 뉴스를 폴링(Polling)하여 업데이트합니다.
* **🔍 검색 및 필터링**: 제목과 요약 내용을 기준으로 뉴스를 실시간 검색할 수 있습니다.
* **📈 키워드 트렌드**: 현재 뉴스 리스트에서 가장 많이 등장한 핵심 키워드 Top 5를 시각화합니다.
* **🌙 다크 모드 지원**: 사용자 환경에 맞춰 라이트/다크 모드를 전환하며, 설정을 로컬 스토리지에 저장합니다.
* **🔊 TTS (음성 듣기)**: Web Speech API를 활용하여 뉴스 요약 내용을 음성으로 읽어줍니다 (속도 조절 가능).
* **✍️ 기사 직접 추가**: 사용자가 직접 기사 원문과 정보를 입력하여 요약(AI 처리 가정) 요청을 보낼 수 있습니다.
* **⚡ 사용자 편의성**:
* 중요 키워드 **하이라이트**
* 기사 내용 **클립보드 복사**
* **스켈레톤 UI** 로딩 처리
* **Scroll To Top** 버튼



---

## 🛠 기술 스택 (Tech Stack)

* **Core**: React, TypeScript, Vite
* **Styling**: Tailwind CSS
* **State Management**: React Hooks (`useState`, `useEffect`, `useContext` 등)
* **UI Components**: `react-hot-toast` (알림), Custom Modals
* **API Client**: Native `fetch` API

---

## 🚀 설치 및 실행 가이드 (Installation)

이 프로젝트를 로컬 환경에서 실행하려면 **Node.js**가 설치되어 있어야 합니다.

### 1. 리포지토리 클론

```bash
git clone https://github.com/your-username/news-ai-frontend.git
cd news-ai-frontend

```

### 2. 패키지 설치

```bash
npm install

```

### 3. 개발 서버 실행

```bash
npm run dev

```

브라우저에서 `http://localhost:5173` (Vite 기본 포트)으로 접속하여 확인합니다.

> **Note**: 정상적인 데이터 표시를 위해서는 **백엔드 서버**가 `http://localhost:4000`에서 실행 중이어야 합니다.

---

## 📂 프로젝트 구조 (Project Structure)

```bash
src/
├── components/
│   ├── Header.tsx           # 상단 헤더 (설정 및 추가 버튼)
│   ├── NewsCard.tsx         # 개별 뉴스 카드 (TTS, 복사, 하이라이트 기능)
│   ├── KeywordTrend.tsx     # 뉴스 키워드 빈도 분석 및 시각화
│   ├── SkeletonCard.tsx     # 데이터 로딩 시 보여줄 스켈레톤 UI
│   ├── SettingsModal.tsx    # 설정 모달 (다크모드, TTS 속도 등)
│   ├── ManualInputModal.tsx # 기사 직접 추가 모달
│   └── ScrollToTop.tsx      # 맨 위로 가기 버튼
├── types.ts                 # TypeScript 인터페이스 정의 (NewsItem 등)
├── App.tsx                  # 메인 로직 (상태 관리, API 호출, 라우팅)
├── main.tsx                 # Entry Point
└── index.css                # Tailwind CSS 설정

```

---

## 🔗 API 연동 (API Integration)

이 프론트엔드는 백엔드 서버(`http://localhost:4000`)와 REST API로 통신합니다.
API 호출 로직은 `App.tsx` 내부에 구현되어 있습니다.

### 1. 최신 뉴스 조회 (Polling)

* **Endpoint**: `GET /api/news/latest`
* **Description**: 서버로부터 최신 뉴스 요약 목록을 받아옵니다.
* **Logic**:
* 앱 실행 시 최초 로드
* `setInterval`을 통해 **5초마다** 새로운 뉴스를 확인하고 리스트 상단에 추가합니다.
* `localStorage`를 활용해 새로고침 후에도 데이터를 유지합니다.



### 2. 뉴스 수동 생성

* **Endpoint**: `POST /api/news/manual`
* **Description**: 사용자가 입력한 기사 정보를 서버로 전송하여 리스트에 추가합니다.
* **Request Body**:
```json
{
  "title": "사용자가 입력한 제목",
  "content": "기사 본문 내용...",
  "press": "신문사 이름",
  "time": "2024-05-21 10:00"
}

```


* **Response**: 생성된 단일 뉴스 객체 (리스트 최상단에 즉시 반영됨)

---

## ⚙️ 설정 및 환경 변수

현재 API 주소는 `App.tsx` 내부에 하드코딩 되어 있습니다. 배포 시 변경이 필요할 수 있습니다.

**App.tsx**

```typescript
const API_URL = "http://localhost:4000/api/news/latest";
const API_MANUAL_URL = "http://localhost:4000/api/news/manual";

```

---

## 🤝 Contributing

1. 이 저장소를 Fork 합니다.
2. 새로운 Feature 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`).
3. 변경 사항을 Commit 합니다 (`git commit -m 'Add some AmazingFeature'`).
4. Branch에 Push 합니다 (`git push origin feature/AmazingFeature`).
5. Pull Request를 요청합니다.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
