'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Loading fallback for React Flow
const ReactFlowFallback = () => (
  <div className="w-full h-[600px] flex items-center justify-center bg-[#0a0a0a] text-[#737373] font-mono border border-[#262626] rounded-lg">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
      <span>Loading visualizer...</span>
    </div>
  </div>
);

// Dynamically import React Flow
const ReactFlowComponent = dynamic(
  () => import('@/components/recursion-tree/RecursionTree'),
  {
    ssr: false,
    loading: ReactFlowFallback,
  }
);

interface LazyReactFlowProps {
  initialData?: any;
  width?: string;
  height?: string;
}

export default function LazyReactFlow(props: LazyReactFlowProps) {
  return (
    <Suspense fallback={<ReactFlowFallback />}>
      <ReactFlowComponent {...props} />
    </Suspense>
  );
}
