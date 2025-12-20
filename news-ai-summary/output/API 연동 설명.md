## 4\. 파트별 산출물 \- FE (Frontend)

### 🔗 API 연동 설명

Frontend는 JavaScript 내장 Fetch API를 사용하여 Backend 서버와 비동기 통신을 수행합니다. 데이터의 실시간성을 보장하기 위해 Polling 기법을 사용하며, 데이터 정합성을 위해 별도의 매핑 로직을 포함하고 있습니다.

#### 1\. 기본 설정 (Configuration)

* Base URL: https://news-gpt-backend.onrender.com/api/news  
* Communication Method: Asynchronous REST API (JSON)

#### 2\. 주요 API 명세 및 연동 현황

| 구분 | HTTP Method | Endpoint | 설명 및 연동 방식 |
| :---- | :---- | :---- | :---- |
| 뉴스 목록 조회 | GET | /latest | • 초기 로드: 앱 실행 시 최신 뉴스 데이터를 받아옵니다. • 검색: Query Parameter(?keyword=검색어)를 통해 특정 키워드 뉴스를 필터링하여 가져옵니다. • 오토 폴링: setInterval을 이용해 5초마다 해당 엔드포인트를 호출하여 최신 상태를 유지합니다. |
| 뉴스 수동 추가 | POST | /manual | • 기능 정의: 사용자가 입력한 뉴스(제목, 내용 등)를 서버에 전송합니다. • 현재 상태: UI 구현 완료. (백엔드 안정화 전까지 사용자에게 '추후 제공 기능' 안내 메시지를 출력하도록 처리됨) |

#### 

#### 3\. 핵심 연동 로직 (Key Logic)

A. 오토 폴링 및 중복 제거 (Auto-Polling & De-duplication)

* 실시간 뉴스 업데이트를 위해 5초 주기로 API를 호출합니다.  
* 단순히 데이터를 덮어쓰지 않고, 제목(Title)을 기준으로 기존 리스트와 비교하여 중복되지 않은 새로운 뉴스만 리스트 최상단에 추가(Prepend)합니다.

| // 중복 제거 예시 로직 const unique \= newArticles.filter(n \=\> \!prev.some(p \=\> p.title \=== n.title)); return \[...unique, ...prev\]; |
| :---- |

B. 데이터 매핑 (Data Mapping / Adapter Pattern)

* 백엔드 API 응답 데이터(RawNewsItem)와 프론트엔드 컴포넌트가 사용하는 데이터 타입(NewsItem) 간의 불일치를 해결하기 위해 매핑 레이어를 구현했습니다.  
* null 값이 들어올 경우를 대비해 기본값(Default Value)을 설정하여 렌더링 에러를 방지했습니다. (예: press 정보 누락 시 "News API"로 대체)

C. 예외 처리 (Error Handling)

* 네트워크 오류나 서버 장애 발생 시 try-catch 블록을 통해 앱이 멈추지 않도록 처리했습니다.  
* 폴링 중 발생하는 에러는 사용자 경험을 해치지 않도록 콘솔에만 로그를 남기고, 사용자의 직접적인 액션(검색 등) 실패 시에는 react-hot-toast를 통해 시각적인 피드백을 제공합니다.

