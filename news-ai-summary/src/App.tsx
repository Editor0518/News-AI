import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import SettingsModal from './components/SettingsModal';
import SkeletonCard from './components/SkeletonCard';
import ManualInputModal from './components/ManualInputModal'; 
import KeywordTrend from './components/KeywordTrend';
import ScrollToTop from './components/ScrollToTop';
import type { NewsItem } from './types';


function App() {
  // 백엔드에서 받아오는 원본 데이터의 생김새 정의 (없을 수도 있는 값은 ? 붙임)
  interface RawNewsItem {
    id?: string;
    title: string;
    press?: string;
    time?: string;
    summary: string;
    keywords?: string[];
    originalUrl?: string;
  }
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enableHighlight, setEnableHighlight] = useState(true);

  //  요약 길이 상태 (설정 모달용)
 // const [summaryLength, setSummaryLength] = useState('기본');

  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);

  // 기획자의 실제 서버 주소 적용
  const API_BASE_URL = "https://news-gpt-backend.onrender.com/api/news";

  // TTS 속도 상태
  const [speechRate, setSpeechRate] = useState(1.0);

  // 다크 모드 상태
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // 다크 모드 적용 Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  // ✅ [수정] 뉴스 데이터 가져오기 (기획자의 안전한 로직 + 검색어 지원)
  const fetchNewsFromApi = async (keyword = "AI"): Promise<NewsItem[]> => {
    try {
      // 기획자 서버 API 스펙에 맞춤 (/latest?keyword=...)
      const response = await fetch(`${API_BASE_URL}/latest?keyword=${encodeURIComponent(keyword)}`);
      
      if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
      
      const data = await response.json();
      // 데이터가 배열인지 확인 (안전장치)
      const rawArticles = Array.isArray(data) ? data : [];

      // 데이터 매핑 (없는 필드는 기본값으로 채움)
      const mappedNews: NewsItem[] = rawArticles.map((item: RawNewsItem, index: number) => ({
        id: item.id || `api-${Date.now()}-${index}`,
        title: item.title,
        press: item.press || "News API",
        time: item.time || new Date().toISOString().slice(0, 16).replace('T', ' '),
        summary: item.summary,
        keywords: item.keywords || [keyword],
        originalUrl: item.originalUrl || "#"
      }));

      return mappedNews;
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      // 오토 폴링 중 에러는 조용히 넘어가기 위해 toast 제거 (필요하면 추가)
      return [];
    }
  };

  // 1. 초기 로드 및 검색 핸들러
  const handleSearch = async () => {
    setLoading(true);
    // 검색어가 있으면 그 검색어로, 없으면 기본값 'AI'로 조회
    const newArticles = await fetchNewsFromApi(searchTerm || "AI");
    
    if (newArticles.length > 0) {
      setNewsList(prev => {
        // 중복 제거 후 합치기
        const unique = newArticles.filter(n => !prev.some(p => p.title === n.title));
        return [...unique, ...prev];
      });
    }
    setLoading(false);
  };

  // 앱 시작 시 1회 실행
  useEffect(() => {
    // 로컬 스토리지 데이터 먼저 로드
    const savedData = localStorage.getItem('news_data');
    if (savedData) {
      setNewsList(JSON.parse(savedData));
    }
    // 그 다음 API 호출
    handleSearch();
  }, []);

  // 2. 로컬스토리지 저장
  useEffect(() => {
    if (newsList.length > 0) {
      localStorage.setItem('news_data', JSON.stringify(newsList));
    }
  }, [newsList]);

  // 3. ✅ [복구] 주기적 폴링 (5초마다 자동 갱신)
  useEffect(() => {
    const intervalId = setInterval(async () => {
      // 현재 검색어가 있으면 그걸로, 없으면 AI로 갱신
      const currentKeyword = searchTerm || "AI";
      const newArticles = await fetchNewsFromApi(currentKeyword);
      
      if (newArticles.length > 0) {
        setNewsList(prev => {
          const unique = newArticles.filter(n => !prev.some(p => p.title === n.title));
          if (unique.length === 0) return prev;
          // 새 뉴스가 있으면 리스트 맨 앞에 추가
          return [...unique, ...prev];
        });
      }
    }, 5000); // 5초

    return () => clearInterval(intervalId);
  }, [searchTerm]); // 검색어가 바뀌면 폴링도 그 검색어로 다시 시작

  // 검색 필터링 (클라이언트 사이드)
  const filteredNews = newsList.filter((news) => 
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    news.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  {/*
  // 사용하지 않음 - 수동 입력 (서버 시도 -> 실패 시 클라이언트 추가)
  const handleManualSubmit = async (title: string, content: string, press: string, date: string) => {
    try {
      // 1. 실제 서버로 전송 시도
      const response = await fetch(`${API_BASE_URL}/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, content, press, 
          time: date.replace('T', ' '),
          length: summaryLength // 설정된 길이 정보도 전송
        }), 
      });

      if (!response.ok) throw new Error('서버 엔드포인트 없음');

      const newArticle = await response.json();
      setNewsList(prev => [newArticle, ...prev]);
      toast.success('기사가 서버에 저장되었습니다!');

    } catch (error) {
      // 2. 서버 실패 시 (아직 구현 안 됨) -> 클라이언트에 임시 추가
      console.warn("서버 저장 실패, 로컬에 임시 저장:", error);
      
      const tempArticle: NewsItem = {
        id: `manual-${Date.now()}`,
        title,
        press,
        time: date.replace('T', ' '),
        summary: `(서버 미연동-임시) ${content.slice(0, 100)}...`,
        keywords: ["수동입력"],
        originalUrl: "#"
      };

      setNewsList(prev => [tempArticle, ...prev]);
      toast.success('기사가 추가되었습니다 (서버 미연동)');
    }
  };
*/}
// ✅ [수정] 수동 입력: 기능 없이 안내 메시지(Toast)만 출력
  const handleManualSubmit = async () => {
    // 백엔드 전송이나 로컬 추가 없이 안내 메시지만 표시
    toast('추후 추가될 기능입니다. 🚧', {
      icon: '🚧',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };
  
  // 데이터 삭제 함수
  const handleClearData = () => {
    localStorage.removeItem('news_data'); // 로컬 스토리지 삭제
    setNewsList([]); // 화면 리스트 초기화
    toast.success('모든 데이터가 삭제되었습니다.');
  };

  return (
    <div className="min-h-screen bg-background pb-10 dark:bg-gray-900 transition-colors duration-300">
      <Header 
        onOpenSettings={() => setIsModalOpen(true)} 
        onOpenInput={() => setIsInputModalOpen(true)}
      />

      <main className="max-w-2xl mx-auto px-4 mt-6">
        <KeywordTrend newsList={newsList} />

        {/* 검색창 UI */}
        <div className="mb-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="관심있는 키워드를 검색해보세요 (예: AI, 경제)... Enter" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // 엔터 키 검색 지원
              onKeyDown={(e) => {
                if(e.key === 'Enter') handleSearch();
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            {/* 검색 버튼 */}
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
              {filteredNews.length}건
            </span>
          </span>
          {loading && <span className="text-primary animate-pulse">업데이트 중...</span>}
        </div>

        {/* 뉴스 리스트 영역 */}
        <div className="flex flex-col gap-5">
          {loading && newsList.length === 0 ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            filteredNews.map((news) => (
              <NewsCard 
                key={news.id} 
                data={news} 
                showHighlight={enableHighlight} 
                speechRate={speechRate} 
              />
            ))
          )}
        </div>

        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            {searchTerm ? "검색 결과가 없습니다." : "서버에서 뉴스를 가져오는 중입니다..."}
          </div>
        )}
      </main>

      {/* 설정 모달 */}
      <SettingsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        highlight={enableHighlight}
        setHighlight={setEnableHighlight}
        speechRate={speechRate}    
        setSpeechRate={setSpeechRate} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode}
        // 요약 길이 상태 전달
//        summaryLength={summaryLength}
//        setSummaryLength={setSummaryLength}
        onClearData={handleClearData}
      />

      <ManualInputModal 
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onSubmit={handleManualSubmit}
      />
      
      <Toaster position="top-center"/>
      <ScrollToTop />
    </div>
  );
}

export default App;