import React, { useState } from 'react';
import toast from 'react-hot-toast'; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // [수정] 부모에게 제목, 본문뿐만 아니라 '언론사', '날짜'도 전달
  onSubmit: (title: string, content: string, press: string, date: string) => Promise<void>;
}

export default function ManualInputModal({ isOpen, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // [추가] 언론사와 날짜 상태 관리
  const [press, setPress] = useState('');
  const [date, setDate] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // 유효성 검사: 모든 항목이 채워져야 함
    if (!title.trim() || !content.trim() || !press.trim() || !date.trim()) {
      //alert('모든 항목(제목, 본문, 언론사, 날짜)을 입력해주세요.');
      toast.error('빈 칸을 모두 입력해주세요!');
      return;
    }

    setIsSubmitting(true);
    // [수정] 4가지 데이터를 모두 전달
    await onSubmit(title, content, press, date); 
    
    // 초기화 및 닫기
    setIsSubmitting(false);
    setTitle('');
    setContent('');
    setPress(''); // 초기화
    setDate('');  // 초기화
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 w-[90%] max-w-lg rounded-xl shadow-2xl p-6 animate-fade-in max-h-[90vh] overflow-y-auto transition-colors duration-300">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">기사 직접 추가</h2>

        {/* 1. 언론사 & 날짜 (한 줄에 배치) */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">언론사</label>
            <input 
              type="text" 
              className="w-full p-3 border border-border dark:border-gray-600 rounded-lg focus:border-primary outline-none bg-white dark:bg-gray-700 dark:text-white"
              placeholder="예: 제주일보"
              value={press}
              onChange={(e) => setPress(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">작성일</label>
            <input 
              type="datetime-local"
              className="w-full p-3 border border-border dark:border-gray-600 rounded-lg focus:border-primary outline-none bg-white dark:bg-gray-700 dark:text-white"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* 제목 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">제목</label>
          <input 
            type="text" 
            className="w-full p-3 border border-border dark:border-gray-600 rounded-lg focus:border-primary outline-none bg-white dark:bg-gray-700 dark:text-white"
            placeholder="기사 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 본문 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">본문 내용</label>
          <textarea 
            className="w-full p-3 border border-border dark:border-gray-600 rounded-lg focus:border-primary outline-none h-40 resize-none bg-white dark:bg-gray-700 dark:text-white"
            placeholder="요약하고 싶은 기사 본문을 붙여넣으세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-500 transition"
            disabled={isSubmitting}
          >
            취소
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition flex justify-center items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? <span className="animate-spin mr-2">⏳</span> : null}
            {isSubmitting ? '요약 중...' : '요약하기'}
          </button>
        </div>
      </div>
    </div>
  );
}