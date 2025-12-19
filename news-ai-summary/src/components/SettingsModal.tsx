interface Props {
  isOpen: boolean;                  // 모달이 열려있는지 여부
  onClose: () => void;              // 닫기 버튼 눌렀을 때 함수
  highlight: boolean;               // 현재 하이라이트 설정 값
  setHighlight: (v: boolean) => void; // 하이라이트 설정 변경 함수
  speechRate: number;                // 속도 값 (숫자)
  setSpeechRate: (v: number) => void; // 속도 변경 함수
  isDarkMode: boolean;           
  setIsDarkMode: (v: boolean) => void; 
}

export default function SettingsModal({ isOpen, onClose, highlight, setHighlight, 
  speechRate, setSpeechRate, isDarkMode, setIsDarkMode }: Props) {
  // 모달이 닫혀있으면 아무것도 그리지 않음
  if (!isOpen) return null;

  return (
    // 배경 (검은색 반투명)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      
      {/* 모달 창 본체 */}
      <div className="bg-white dark:bg-gray-800 w-[90%] max-w-sm rounded-xl shadow-2xl p-6 animate-fade-in transition-colors duration-300">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">설정</h2>

        {/* 1. 요약 길이 선택 (기획서 반영) */}
        <div className="mb-6">
          {/* [수정] 라벨: 완전 흰색으로 변경 */}
          <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2">요약 길이</label>
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {['짧게', '기본', '길게'].map((option) => (
              <button
                key={option}
                className={`flex-1 py-2 text-sm rounded-md transition-all ${
                  option === '기본'
                    ? 'bg-white dark:bg-gray-600 text-primary shadow-sm font-bold dark:text-white' // 선택됨
                    : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white' // 선택 안됨
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* 2. 음성 속도 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            {/* [수정] 라벨: 완전 흰색으로 변경 */}
            <label className="text-sm font-semibold text-gray-700 dark:text-white">음성 속도</label>
            <span className="text-sm font-bold text-primary">{speechRate.toFixed(1)}x</span>
          </div>
          
          <input
            type="range" min="0.5" max="2.0" step="0.1"
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          
          {/* [수정] 슬라이더 하단 작은 글씨: 밝은 회색(gray-200)으로 변경 */}
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-200 mt-1">
            <span>느림(0.5)</span>
            <span>보통(1.0)</span>
            <span>빠름(2.0)</span>
          </div>
        </div>

        {/* 3. 다크 모드 토글 */}
        <div className="mb-6 flex justify-between items-center">
          {/* [수정] 라벨: 완전 흰색으로 변경 */}
          <label className="text-sm font-semibold text-gray-700 dark:text-white">다크 모드</label>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
              isDarkMode ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
              isDarkMode ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* 4. 하이라이트 옵션 */}
        <div className="mb-8 flex justify-between items-center">
          {/* [수정] 라벨: 완전 흰색으로 변경 */}
          <label className="text-sm font-semibold text-gray-700 dark:text-white">키워드 하이라이트</label>
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