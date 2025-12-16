import React from 'react';
import type { NewsItem } from '../types'; // 3단계에서 만든 types.ts 불러오기

interface Props {
  data: NewsItem;
  showHighlight: boolean; // [추가] 부모(App)에서 설정값을 받아옵니다.
}

export default function NewsCard({ data, showHighlight }: Props) { // props에 showHighlight 추가
  
  const highlightKeywords = (text: string, keywords: string[]) => {
    // [수정] 설정이 꺼져있으면 하이라이트 처리 안 함
    if (!showHighlight) return { __html: text };

    let highlightedText = text;
    // ... 기존 로직 그대로 ...
    keywords.forEach((keyword) => {
      highlightedText = highlightedText.replace(
        new RegExp(keyword, 'g'),
        `<span class="bg-highlight px-1 rounded-sm font-medium">${keyword}</span>`
      );
    });
    return { __html: highlightedText };
  };

  // ... return 부분은 동일함 ...

  return (
    <article className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        {/* 1. 기사 제목 */}
        <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
          {data.title}
        </h2>
        
        {/* 2. 언론사 & 시간 (메타데이터) */}
        <div className="flex items-center text-xs text-sub-text mb-4 space-x-2">
          <span className="font-semibold text-gray-500">{data.press}</span>
          <span>•</span>
          <span>{data.time}</span>
        </div>

        {/* 3. AI 요약 본문 (형광펜 적용됨) */}
        <div 
          className="text-[15px] text-gray-700 leading-relaxed mb-5 break-keep"
          dangerouslySetInnerHTML={highlightKeywords(data.summary, data.keywords)}
        />

        {/* 4. 하단 버튼 영역 */}
        <div className="flex justify-end">
          <a 
            href={data.originalUrl} 
            target="_blank" 
            rel="noreferrer" // 보안을 위해 필수
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-blue-50 transition-colors"
          >
            원문 보기
          </a>
        </div>
      </div>
    </article>
  );
}