// src/components/SkeletonCard.tsx
import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-border p-5 mb-4 shadow-sm animate-pulse">
      {/* 제목 스켈레톤 */}
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      
      {/* 메타데이터(언론사, 시간) 스켈레톤 */}
      <div className="flex gap-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>

      {/* 본문 스켈레톤 (3줄 정도) */}
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>

      {/* 버튼 영역 스켈레톤 */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
        <div className="h-9 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}