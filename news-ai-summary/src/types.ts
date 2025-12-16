// 뉴스 데이터의 형태를 정의 (C#의 Struct/Class와 비슷합니다)
export interface NewsItem {
  id: string;          // 고유 ID
  title: string;       // 기사 제목
  press: string;       // 언론사
  time: string;        // 기사 시간
  summary: string;     // AI 요약 본문
  keywords: string[];  // 하이라이트할 핵심 키워드 목록
  originalUrl: string; // 원문 링크
}