// 부모에게서 받을 함수 타입 정의
interface Props {
  onOpenSettings: () => void;
  onOpenInput: () => void;
}

// props로 onOpenSettings를 받음
export default function Header({ onOpenSettings, onOpenInput }: Props) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-800 border-b border-border dark:border-gray-700 px-4 py-3 flex justify-between items-center shadow-sm transition-colors duration-300">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
        NewsAI <span className="text-primary">요약</span>
      </h1>
      
      <div className="flex gap-2">
        {/* 3. 기사 추가 버튼에 연결 */}
        <button 
          onClick={onOpenInput} 
          className="p-2 text-primary hover:bg-blue-50 transition-colors rounded-full"
          title="기사 직접 추가"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>

      {/* [수정] 버튼에 onClick 이벤트 연결 */}
      <button 
        onClick={onOpenSettings} // 버튼을 누르면 부모가 준 함수 실행
        
        className="p-2 text-sub-text hover:text-primary transition-colors rounded-full hover:bg-gray-100"
        aria-label="설정"
      >
        <span className="text-sm font-medium">설정</span>
      </button>
      </div>
    </header>
  );
}