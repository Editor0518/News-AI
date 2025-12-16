// [추가] 부모에게서 받을 함수 타입 정의
interface Props {
  onOpenSettings: () => void;
}

// [수정] props로 onOpenSettings를 받음
export default function Header({ onOpenSettings }: Props) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border px-4 py-3 flex justify-between items-center shadow-sm">
      <h1 className="text-xl font-bold text-gray-900 tracking-tight">
        NewsAI <span className="text-primary">요약</span>
      </h1>
      
      {/* [수정] 버튼에 onClick 이벤트 연결 */}
      <button 
        onClick={onOpenSettings} // 버튼을 누르면 부모가 준 함수 실행
        className="p-2 text-sub-text hover:text-primary transition-colors rounded-full hover:bg-gray-100"
        aria-label="설정"
      >
        <span className="text-sm font-medium">설정</span>
      </button>
    </header>
  );
}