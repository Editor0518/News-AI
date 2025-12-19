
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import SettingsModal from './components/SettingsModal';
import SkeletonCard from './components/SkeletonCard'; // 스켈레톤 불러오기
import ManualInputModal from './components/ManualInputModal'; 
import KeywordTrend from './components/KeywordTrend';
import ScrollToTop from './components/ScrollToTop';
import type { NewsItem } from './types';

function App() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enableHighlight, setEnableHighlight] = useState(true);

  // [추가] 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);

  const API_URL = "http://localhost:4000/api/news/latest";

  // [추가] 백엔드 개발자가 만들어줄 저장용 API (POST)
  const API_MANUAL_URL = "http://localhost:4000/api/news/manual";

  // [추가] TTS 속도 상태 (기본값: 1.0)
  const [speechRate, setSpeechRate] = useState(1.0);


  // [추가] 다크 모드 상태 (로컬 스토리지에서 불러오기)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // [추가] 다크 모드 변경 시 HTML 태그에 클래스 적용 & 저장
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  const fetchNewsFromApi = async (): Promise<NewsItem[]> => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
      const data = await response.json();
      return data as NewsItem[];
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      return [];
    }
  };

  // 1. 초기 로드 (로컬스토리지 + 최초 API 호출)
  useEffect(() => {
    const initData = async () => {
      // 로컬 스토리지 확인
      const savedData = localStorage.getItem('news_data');
      if (savedData) {
        setNewsList(JSON.parse(savedData));
      } else {
        // 저장된 게 없으면 로딩 UI를 보여주며 API 호출
        setLoading(true);
      }

      // 최신 데이터 가져오기
      const newArticles = await fetchNewsFromApi();
      if (newArticles.length > 0) {
        setNewsList(prev => {
          // 중복 제거 후 합치기
          const unique = newArticles.filter(n => !prev.some(p => p.id === n.id));
          return [...unique, ...prev];
        });
      }
      setLoading(false); // 로딩 끝
    };

    initData();
  }, []);

  // 2. 로컬스토리지 저장
  useEffect(() => {
    if (newsList.length > 0) {
      localStorage.setItem('news_data', JSON.stringify(newsList));
    }
  }, [newsList]);

  // 3. 주기적 폴링 (Polling)
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const newArticles = await fetchNewsFromApi();
      if (newArticles.length > 0) {
        setNewsList(prev => {
          const unique = newArticles.filter(n => !prev.some(p => p.id === n.id));
          if (unique.length === 0) return prev;
          return [...unique, ...prev];
        });
      }
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // [추가] 검색 필터링 로직
  // 뉴스 리스트에서 검색어가 포함된 것만 걸러냄
  const filteredNews = newsList.filter((news) => 
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    news.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleManualSubmit = async (title: string, content: string, press: string, date: string) => {
    try {
      const response = await fetch(API_MANUAL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // [수정] 백엔드에 보낼 JSON 데이터에 press와 time 추가
        body: JSON.stringify({ 
          title: title, 
          content: content,
          press: press,        // 신문사 정보
          time: date.replace('T', ' ') // 날짜 포맷 살짝 다듬기 (2024-05-21T10:00 -> 2024-05-21 10:00)
        }), 
      });

      if (!response.ok) throw new Error('요약 실패');

      const newArticle = await response.json();

      setNewsList(prev => [newArticle, ...prev]);
      
      toast.success('기사가 성공적으로 추가되었습니다!');

    } catch (error) {
      console.error(error);
      toast.error('요약 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-10 dark:bg-gray-900 transition-colors duration-300">
      {/* [수정] 헤더에 입력창 열기 함수 전달 */}
      <Header 
        onOpenSettings={() => setIsModalOpen(true)} 
        onOpenInput={() => setIsInputModalOpen(true)} // [추가]
      />

      <main className="max-w-2xl mx-auto px-4 mt-6">
        {/* [추가] 1. 검색창 바로 아래에 키워드 트렌드 배치 */}
        <KeywordTrend newsList={newsList} />

        {/* 검색창 UI */}
        <div className="mb-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="관심있는 키워드를 검색해보세요 (예: AI, 경제)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm
                bg-white dark:bg-gray-800              /* 배경: 흰색 -> 어두운 회색 */
                text-gray-900 dark:text-white          /* 글자: 검정 -> 흰색 */
                dark:border-gray-700                   /* 테두리: 어두운 회색 */
                dark:placeholder-gray-400"             /* 안내문구: 밝은 회색 */
            />
            {/* 돋보기 아이콘 (SVG) */}
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        {/* 상태 표시바 */}
        <div className="mb-4 flex justify-between items-center text-sm text-sub-text">
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
          {/* 1. 로딩 중이고 데이터가 하나도 없을 때 -> 스켈레톤 보여주기 */}
          {loading && newsList.length === 0 ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            /* 2. 데이터가 있을 때 -> 필터된 뉴스 보여주기 */
            filteredNews.map((news) => (
              <NewsCard 
                key={news.id} 
                data={news} 
                showHighlight={enableHighlight} 
                speechRate={speechRate} // [추가] 카드에 속도 설정 전달
              />
            ))
          )}
        </div>

        {/* 데이터 없음 처리 */}
        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            {searchTerm ? "검색 결과가 없습니다." : "새로운 뉴스를 기다리고 있습니다..."}
          </div>
        )}
      </main>
        {/* 설정 모달 (기존) */}
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
      {/* [추가] 기사 입력 모달 배치 */}
      <ManualInputModal 
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onSubmit={handleManualSubmit}
      />
      <Toaster />
      {/* [추가] 2. 스크롤 탑 버튼 (화면 구석에 고정됨) */}
      <ScrollToTop />
    </div>
    
  );
}

export default App;