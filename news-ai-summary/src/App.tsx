import { useEffect, useState } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import SettingsModal from './components/SettingsModal'; // [추가]
import type { NewsItem } from './types'; // 2번 해결책대로 import type 사용

function App() {
  // 뉴스 데이터를 담을 그릇 (초기값은 빈 배열)
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  
  // 로딩 상태 표시를 위한 변수
  const [loading, setLoading] = useState(false);

  // [추가] 모달 열림/닫힘 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // [추가] 하이라이트 기능 On/Off 상태 관리 (기본값: true)
  const [enableHighlight, setEnableHighlight] = useState(true);

  // [테스트용 가짜 백엔드] 
  // 실제 서버가 없으니, 5초마다 새로운 뉴스를 랜덤으로 만들어내는 함수입니다.
  const fetchMockNews = async (): Promise<NewsItem> => {
    // 실제 개발 시엔 여기서 await fetch('서버주소')를 하게 됩니다.
    const randomId = Date.now().toString(); 
    const nowTime = new Date().toLocaleTimeString();
    
    return {
      id: randomId,
      title: `[속보] AI 뉴스 요약 서비스, 드디어 메인 화면 구현 성공 (${nowTime})`,
      press: "제주대 컴퓨터공학과",
      time: "방금 전",
      summary: "프론트엔드 개발자가 React와 TypeScript를 활용하여 뉴스 피드 UI를 완성했다. 특히 자동 갱신 기능과 로컬 저장소 연동이 특징이다.",
      keywords: ["React", "자동 갱신", "로컬 저장소"], // 노란색 형광펜 칠할 단어들
      originalUrl: "#"
    };
  };

  // -------------------------------------------------------
  // 기능 1. [요청 8-1] 앱이 켜질 때 로컬 저장소(내컴퓨터)에서 데이터 꺼내오기
  // -------------------------------------------------------
  useEffect(() => {
    const savedData = localStorage.getItem('news_data');
    if (savedData) {
      // 저장된 게 있으면 그걸로 뉴스 리스트 채우기
      setNewsList(JSON.parse(savedData));
    }
  }, []); // [] : 이 코드는 앱 시작 시 딱 1번만 실행됨

  // -------------------------------------------------------
  // 기능 2. [요청 8-1] 뉴스 리스트가 변할 때마다 로컬 저장소에 자동 저장
  // -------------------------------------------------------
  useEffect(() => {
    // 뉴스 리스트가 비어있지 않을 때만 저장
    if (newsList.length > 0) {
      localStorage.setItem('news_data', JSON.stringify(newsList));
    }
  }, [newsList]); // [newsList] : newsList 내용이 바뀔 때마다 이 코드가 실행됨

  // -------------------------------------------------------
  // 기능 3. [요청 8-2] 5초마다 자동으로 새 뉴스 가져오기 (Polling)
  // -------------------------------------------------------
  useEffect(() => {
    const updateNews = async () => {
      setLoading(true); // 로딩 시작 (깜빡임 등 처리에 사용 가능)
      try {
        const newArticle = await fetchMockNews();
        
        // 중요: 기존 리스트(prev)의 '앞'에 새 뉴스(newArticle)를 붙임
        setNewsList(prev => [newArticle, ...prev]); 
      } catch (error) {
        console.error("뉴스 가져오기 실패", error);
      } finally {
        setLoading(false); // 로딩 끝
      }
    };

    // 1. 처음 들어오자마자 한번 실행
    updateNews();

    // 2. 5초(5000ms)마다 실행되는 타이머 설정
    const intervalId = setInterval(updateNews, 5000);

    // 3. 사용자가 페이지를 나가면 타이머 끄기 (청소)
    return () => clearInterval(intervalId);
  }, []);

  // -------------------------------------------------------
  // 화면 렌더링 (보여지는 부분)
  // -------------------------------------------------------
  return (
    <div className="min-h-screen bg-background pb-10">
      {/* 1. 헤더 (상단 고정) */}
      {/* [수정] div 래퍼를 제거하고, 함수를 직접 전달합니다 */}
      <Header onOpenSettings={() => setIsModalOpen(true)} />

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="max-w-2xl mx-auto px-4 mt-6">
        
        {/* 안내 문구 */}
        <div className="mb-4 flex justify-between items-center text-sm text-sub-text">
          <span>실시간 뉴스 피드</span>
          {loading && <span className="text-primary animate-pulse">업데이트 중...</span>}
        </div>

        {/* 3. 뉴스 카드 리스트 뿌리기 */}
        <div className="flex flex-col gap-5">
          {newsList.map((news) => (
            <NewsCard 
              key={news.id} 
              data={news} 
              showHighlight={enableHighlight} // [추가] 설정값 전달
            />
          ))}
        </div>

        {/* 데이터가 없을 때 표시할 화면 */}
        {newsList.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-400">
            새로운 뉴스를 기다리고 있습니다...
          </div>
        )}
      </main>
      {/* [추가] 설정 모달 컴포넌트 배치 */}
      <SettingsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        highlight={enableHighlight}
        setHighlight={setEnableHighlight}
      />
    </div>
  );
}

export default App;