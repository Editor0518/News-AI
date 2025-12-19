import React, { useMemo } from 'react';
import type { NewsItem } from '../types';

interface Props {
  newsList: NewsItem[];
}

export default function KeywordTrend({ newsList }: Props) {
  // 뉴스 리스트가 변할 때마다 키워드 순위 다시 계산
  const topKeywords = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // 1. 모든 뉴스에서 키워드 추출 및 카운팅
    newsList.forEach(news => {
      news.keywords.forEach(keyword => {
        counts[keyword] = (counts[keyword] || 0) + 1;
      });
    });

    // 2. 많이 나온 순서대로 정렬해서 Top 5 자르기
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a) // 내림차순 정렬
      .slice(0, 5); // 상위 5개
  }, [newsList]);

  if (newsList.length === 0) return null;

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl border border-border dark:border-gray-700 p-5 shadow-sm transition-colors duration-300">
      <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
        <span>🔥</span> 실시간 핫 키워드
      </h3>
      <div className="flex flex-wrap gap-2">
        {topKeywords.map(([keyword, count], index) => (
          <div 
            key={keyword}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-default
              ${index === 0 ? 'bg-primary text-white scale-105 shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}
            `}
          >
            <span className="mr-1"># {keyword}</span>
            <span className="text-xs opacity-80 bg-black/10 px-1 rounded-full">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}