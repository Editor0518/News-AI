/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // [기획서 1페이지] 컬러 가이드 반영
        primary: '#3B72FF',       // Main Color
        'primary-dark': '#2D4EC8', // Hover Color
        background: '#F4F4F4',    // Sub Color (배경)
        border: '#E5E5E5',        // Sub Color (테두리)
        'sub-text': '#8A8A8A',    // 보조 텍스트
        highlight: '#FFD936',     // Accent Color (키워드 강조)
      }
    },
  },
  plugins: [],
}