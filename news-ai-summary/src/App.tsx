import { useEffect, useState } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import SettingsModal from './components/SettingsModal';
import type { NewsItem } from './types';

function App() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enableHighlight, setEnableHighlight] = useState(true);

  const API_URL = "http://localhost:4000/api/news/latest";

  const fetchNewsFromApi = async (): Promise<NewsItem[]> => {
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      return data as NewsItem[]; // 서버가 배열([]) 형태로 준다고 가정

    } catch (error) {
      console.error("뉴스 데이터를 불러오는데 실패했습니다:", error);
      return []; // 에러 발생 시 빈 배열 반환
    }
  };

  // 1. 앱 켜질 때 로컬 저장소에서 불러오기 (기존 동일)
  useEffect(() => {
    const savedData = localStorage.getItem('news_data');
    if (savedData) {
      setNewsList(JSON.parse(savedData));
    }
  }, []);

  // 2. 뉴스 리스트가 바뀔 때마다 로컬 저장소에 저장 (기존 동일)
  useEffect(() => {
    if (newsList.length > 0) {
      localStorage.setItem('news_data', JSON.stringify(newsList));
    }
  }, [newsList]);

  // 3. 주기적으로 서버에 요청해서 새 뉴스 가져오기 (Polling)
  useEffect(() => {
    const updateNews = async () => {
      // 로딩 표시를 너무 자주 하면 눈이 아플 수 있어서, 원하시면 주석 처리해도 됩니다.
      // setLoading(true); 

      try {
        // 서버에서 최신 뉴스 목록을 받아옴
        const newArticles = await fetchNewsFromApi();
        
        if (newArticles.length > 0) {
          setNewsList(prevList => {
            // ✅ [중요] 중복 제거 로직
            // 서버에서 받아온 것(newArticles) 중, 내 리스트(prevList)에 없는 것만 골라냄
            const uniqueNewArticles = newArticles.filter(
              newItem => !prevList.some(existing => existing.id === newItem.id)
            );

            // 진짜 새로운 게 없으면 기존 리스트 유지
            if (uniqueNewArticles.length === 0) return prevList;

            // 새로운 기사를 맨 앞에 붙이고 기존 기사는 뒤로
            return [...uniqueNewArticles, ...prevList];
          });
        }
      } catch (error) {
        console.error("업데이트 실패", error);
      } finally {
        setLoading(false);
      }
    };

    // 처음 접속 시 즉시 실행
    updateNews();

    // 5초마다 실행
    const intervalId = setInterval(updateNews, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header onOpenSettings={() => setIsModalOpen(true)} />

      <main className="max-w-2xl mx-auto px-4 mt-6">
        <div className="mb-4 flex justify-between items-center text-sm text-sub-text">
          <span>실시간 뉴스 피드</span>
          {loading && <span className="text-primary animate-pulse">업데이트 중...</span>}
        </div>

        <div className="flex flex-col gap-5">
          {newsList.map((news) => (
            <NewsCard 
              key={news.id} 
              data={news} 
              showHighlight={enableHighlight} 
            />
          ))}
        </div>

        {newsList.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-400">
            아직 뉴스가 없습니다. 서버 상태를 확인해주세요.
          </div>
        )}
      </main>

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