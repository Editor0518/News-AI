// src/components/NewsCard.tsx
import { useState } from 'react';
import type { NewsItem } from '../types';

interface Props {
  data: NewsItem;
  showHighlight: boolean;
  speechRate: number; // [추가] 부모로부터 속도 값을 받음
}

export default function NewsCard({ data, showHighlight, speechRate }: Props) {
  // 복사 후 "복사됨!" 메시지를 잠깐 보여주기 위한 상태
  const [isCopied, setIsCopied] = useState(false);

  // 1. 하이라이트 로직
  const highlightKeywords = (text: string, keywords: string[]) => {
    if (!showHighlight) return { __html: text };
    let highlightedText = text;
    keywords.forEach((keyword) => {
      highlightedText = highlightedText.replace(
        new RegExp(keyword, 'g'),
        // text-black 클래스 추가 (노란 배경 위 검은 글씨 강제)
        `<span class="bg-highlight text-black px-1 rounded-sm font-medium">${keyword}</span>`
      );
    });
    return { __html: highlightedText };
  };

  // 2. TTS (듣기) 기능
  const handleSpeak = () => {
    // 말하고 있을 때 누르면 멈춤
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(`${data.title}. ${data.summary}`);
    utterance.lang = 'ko-KR';
    
    // 여기서 속도를 적용합니다!
    utterance.rate = speechRate; 
    
    window.speechSynthesis.speak(utterance);
  };
  // 3. 복사하기 기능
  const handleCopy = async () => {
    try {
      // 클립보드에 텍스트 복사
      await navigator.clipboard.writeText(`[${data.title}]\n\n${data.summary}\n\n출처: ${data.originalUrl}`);
      
      // 복사 성공 시 버튼 상태 변경
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2초 뒤 원상복구
    } catch (err) {
      console.error('복사 실패', err);
      alert('복사에 실패했습니다.');
    }
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl border border-border dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug">
          {data.title}</h2>
        
        <div className="flex items-center text-xs text-sub-text dark:text-gray-400 mb-4 space-x-2">
          <span className="font-semibold text-gray-500 dark:text-gray-300">{data.press}</span>
          <span>•</span>
          <span>{data.time}</span>
        </div>

        <div 
          className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed mb-5 break-keep"
          dangerouslySetInnerHTML={highlightKeywords(data.summary, data.keywords)}
        />

        {/* 하단 버튼 액션 영역 */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          
          {/* 왼쪽: 기능 버튼들 (듣기, 복사) */}
          <div className="flex space-x-3">
            <button 
              onClick={handleSpeak}
              className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
            >
              <span>🔊</span>
              <span className="hidden sm:inline">듣기</span>
            </button>

            <button 
              onClick={handleCopy}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                isCopied ? 'text-green-600 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-primary'
              }`}
            >
              <span>{isCopied ? '✅' : '📋'}</span>
              <span>{isCopied ? '복사됨' : '복사'}</span>
            </button>
          </div>

          {/* 오른쪽: 원문 보기 */}
          <a 
            href={data.originalUrl} 
            target="_blank" 
            rel="noreferrer"
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
          >
            원문 보기
          </a>
        </div>
      </div>
    </article>
  );
}