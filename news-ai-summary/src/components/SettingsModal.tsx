interface Props {
  isOpen: boolean;                  // 모달이 열려있는지 여부
  onClose: () => void;              // 닫기 버튼 눌렀을 때 함수
  highlight: boolean;               // 현재 하이라이트 설정 값
  setHighlight: (v: boolean) => void; // 하이라이트 설정 변경 함수
}

export default function SettingsModal({ isOpen, onClose, highlight, setHighlight }: Props) {
  // 모달이 닫혀있으면 아무것도 그리지 않음
  if (!isOpen) return null;

  return (
    // 배경 (검은색 반투명)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      
      {/* 모달 창 본체 */}
      <div className="bg-white w-[90%] max-w-sm rounded-xl shadow-2xl p-6 animate-fade-in">
        <h2 className="text-xl font-bold mb-6 text-gray-900">설정</h2>

        {/* 1. 요약 길이 선택 (기획서 반영) */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">요약 길이</label>
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            {['짧게', '기본', '길게'].map((option) => (
              <button
                key={option}
                className={`flex-1 py-2 text-sm rounded-md transition-all ${
                  option === '기본' // 지금은 UI만 보여주기 위해 '기본'만 활성화
                    ? 'bg-white text-primary shadow-sm font-bold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* 2. 하이라이트 옵션 (기획서 반영) */}
        <div className="mb-8 flex justify-between items-center">
          <label className="text-sm font-semibold text-gray-700">키워드 하이라이트</label>
          
          {/* 토글 스위치 UI */}
          <button 
            onClick={() => setHighlight(!highlight)}
            className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
              highlight ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
              highlight ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
}