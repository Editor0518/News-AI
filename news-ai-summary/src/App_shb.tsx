import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import SettingsModal from './components/SettingsModal';
import SkeletonCard from './components/SkeletonCard';
import ManualInputModal from './components/ManualInputModal';
import KeywordTrend from './components/KeywordTrend';
import ScrollToTop from './components/ScrollToTop';
import type { NewsItem } from './types';

function App() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enableHighlight, setEnableHighlight] = useState(true);

  // 검색어 및 모달 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);

  // [수정] 백엔드 포트가 8000번으로 변경됨 (FastAPI 기본 포트)
  const API_URL = "http://localhost:8000/api/news";
  // [주의] 현재 새 백엔드에는 수동 추가(POST) 기능이 아직 없습니다!
  // const API_MANUAL_URL = "http://localhost:8000/api/news/manual"; 

  // 다크 모드
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // TTS 속도
  const [speechRate, setSpeechRate] = useState(1.0);
  
  // ✅ [핵심 수정] 백엔드에서 뉴스 가져오는 함수
  const fetchNewsFromApi = async (keyword = "AI"): Promise<NewsItem[]> => {
    try {
      // 쿼리 스트링으로 검색어 전달 (?keyword=...)
      const response = await fetch(`${API_URL}?keyword=${encodeURIComponent(keyword)}`);
      
      if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
      
      // 백엔드 응답 구조: { "news": [ ... ] }
      const data = await response.json();
      const rawArticles = data.news || []; // news 키 안에 배열이 있음

      // 🔄 [데이터 매핑] 백엔드 데이터 -> 프론트엔드 NewsItem 형태로 변환
      const mappedNews: NewsItem[] = rawArticles.map((item: { title: string; summary: string }, index: number) => ({
        id: `api-${Date.now()}-${index}`, // ID가 없으므로 임시 생성
        title: item.title,
        press: "News API",    // 백엔드에 없음 -> 임시값
        time: new Date().toLocaleTimeString(), // 백엔드에 없음 -> 현재시간
        summary: item.summary,
        keywords: [keyword, "News"], // 백엔드에 없음 -> 검색어로 대체
        originalUrl: "#" // 백엔드에 없음 -> 임시값
      }));

      return mappedNews;
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      toast.error("뉴스를 불러오지 못했습니다.");
      return [];
    }
  };

  // 1. 초기 로드 및 검색 실행
  // 검색어가 바뀌고 엔터를 치거나 검색 버튼을 눌렀을 때 실행하는 게 좋지만,
  // 여기서는 편의상 useEffect에서 검색어가 바뀔 때마다(Debounce 없이) 호출하거나
  // 초기 로딩만 처리하고 검색은 별도 함수로 뺍니다.
  
  // 여기서는 '검색어 입력 후 엔터' 칠 때 호출하도록 구조를 잡겠습니다.
  const handleSearch = async () => {
    setLoading(true);
    const newArticles = await fetchNewsFromApi(searchTerm || "AI"); // 검색어 없으면 기본 'AI'
    setNewsList(newArticles); // 검색 결과로 리스트 교체
    setLoading(false);
  };

  // 앱 시작 시 1회 실행
  useEffect(() => {
    handleSearch();
  }, [handleSearch]); // handleSearch 의존성 추가

  // 로컬스토리지 저장
  useEffect(() => {
    if (newsList.length > 0) {
      localStorage.setItem('news_data', JSON.stringify(newsList));
    }
  }, [newsList]);


  // [주의] 새 백엔드에는 아직 POST 기능이 없어서 가짜로 동작하게 수정함
  const handleManualSubmit = async (title: string, content: string, press: string, date: string) => {
    // 임시: 백엔드 기능이 없으므로 프론트에서 바로 추가되는 척만 함
    const newArticle: NewsItem = {
      id: `manual-${Date.now()}`,
      title,
      press,
      time: date.replace('T', ' '),
      summary: "백엔드 POST 기능 구현 대기중: " + content.substring(0, 50) + "...",
      keywords: ["수동입력"],
      originalUrl: "#"
    };
    
    setNewsList(prev => [newArticle, ...prev]);
    toast.success('기사가 추가되었습니다 (백엔드 미연동)');
  };

  return (
    <div className="min-h-screen bg-background pb-10 dark:bg-gray-900 transition-colors duration-300">
      <Toaster position="top-center" />
      
      <Header 
        onOpenSettings={() => setIsModalOpen(true)} 
        onOpenInput={() => setIsInputModalOpen(true)} 
      />

      <main className="max-w-2xl mx-auto px-4 mt-6">
        
        {/* 키워드 트렌드 (현재 리스트 기준 분석) */}
        <KeywordTrend newsList={newsList} />

        {/* 검색창 UI */}
        <div className="mb-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="관심있는 키워드를 검색해보세요 (예: AI, Economy)... Enter" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(); // 엔터 키 누르면 검색
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            
            {/* 검색 버튼 추가 */}
            <button 
              onClick={handleSearch}
              className="absolute right-2 top-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
            >
              검색
            </button>
          </div>
        </div>

        {/* 상태 표시바 */}
        <div className="mb-4 flex justify-between items-center text-sm text-sub-text dark:text-gray-400">
          <span>
            {searchTerm ? `'${searchTerm}' 검색 결과` : '실시간 뉴스 피드'}
            <span className="ml-1 font-bold text-primary">
              {newsList.length}건
            </span>
          </span>
          {loading && <span className="text-primary animate-pulse">데이터 가져오는 중...</span>}
        </div>

        {/* 뉴스 리스트 영역 */}
        <div className="flex flex-col gap-5">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            newsList.map((news) => (
              <NewsCard 
                key={news.id} 
                data={news} 
                showHighlight={enableHighlight} 
                speechRate={speechRate} 
              />
            ))
          )}
        </div>

        {!loading && newsList.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            검색 결과가 없거나 서버가 꺼져있습니다.
          </div>
        )}
      </main>

      <SettingsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        highlight={enableHighlight}
        setHighlight={setEnableHighlight}
        speechRate={speechRate}       
        setSpeechRate={setSpeechRate} 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}

      />

      <ManualInputModal 
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onSubmit={handleManualSubmit}
      />
      
      <ScrollToTop />
    </div>
  );
}

export default App;