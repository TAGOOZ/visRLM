'use client';

import { motion } from 'framer-motion';
import { EXAMPLE_CONTEXT } from './types';
import { FileText } from 'lucide-react';
import { useRef, useEffect } from 'react';

export function ContextScene() {
  const lines = EXAMPLE_CONTEXT.split('\n');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Highlight section: Database Pool section with performance improvement
  const highlightStartLine = 91; // "## 2. Database Connection Pool"
  const highlightEndLine = 115; // Performance comment line
  const performanceImprovementLine = 114; // Line with "450ms to 120ms"

  // Auto-scroll to highlighted section after initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        // Scroll to position where Database Pool section is visible
        const lineHeight = 24; // 24px per line (leading-6 = 1.5rem = 24px)
        const targetScroll = (highlightStartLine - 5) * lineHeight; // Scroll to 5 lines before highlight
        scrollContainerRef.current.scrollTo({
          top: targetScroll,
          behavior: 'smooth',
        });
      }
    }, 1500); // Wait 1.5s before scrolling

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center bg-[#0a0e27] p-2 sm:p-4 md:p-8"
      style={{ zIndex: 20 }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
        className="w-full max-w-3xl bg-[#1a1f3a] rounded-xl border border-[#2a3050] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-[#252a4a] px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex items-center gap-2 sm:gap-3 border-b border-[#2a3050]">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#58C4DC]" />
          <span className="text-xs sm:text-sm text-[#9FA4B8] font-mono">api_server.py</span>
          <span className="text-[10px] sm:text-xs text-[#f59e0b] ml-2 font-mono">(Fictional Demo)</span>
          <span className="text-[10px] sm:text-xs text-[#6B7280] ml-auto hidden sm:block">
            {EXAMPLE_CONTEXT.length.toLocaleString()} characters • 450 lines
          </span>
        </div>

        {/* Content with Line Numbers */}
        <div ref={scrollContainerRef} className="p-2 sm:p-4 md:p-6 font-mono text-xs sm:text-sm max-h-[calc(100vh-200px)] sm:max-h-[480px] overflow-y-auto scroll-smooth">
          <div className="flex">
            {/* Line Numbers */}
            <div className="flex-shrink-0 pr-2 sm:pr-4 border-r border-[#2a3050] text-right select-none">
              {lines.map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02, duration: 0.3 }}
                  className="text-[#6B7280] text-[10px] sm:text-xs leading-5 sm:leading-6 w-6 sm:w-8"
                >
                  {idx + 1}
                </motion.div>
              ))}
            </div>

            {/* Code Content */}
            <div className="pl-4 flex-1">
              {lines.map((line, idx) => {
                const lineNumber = idx + 1;
                const isInHighlightSection = lineNumber >= highlightStartLine && lineNumber <= highlightEndLine;
                const isPerformanceLine = lineNumber === performanceImprovementLine;
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      backgroundColor: isPerformanceLine ? '#FFFF00' : 'transparent',
                    }}
                    transition={{ 
                      delay: idx * 0.01, 
                      duration: 0.3,
                      backgroundColor: { delay: 2, duration: 0.5 }
                    }}
                    className={`leading-6 whitespace-pre-wrap ${isPerformanceLine ? 'px-1 -mx-1 rounded' : ''}`}
                  >
                    <span 
                      className={`
                        ${line.startsWith('#') && line.includes('##') ? 'text-[#58C4DC] font-semibold' : ''}
                        ${line.includes('BUG FIX') || line.includes('CRITICAL') || line.includes('TODO') ? 'text-[#FFFF00]' : ''}
                        ${line.includes('Performance:') || line.includes('450ms to 120ms') ? 'text-[#0a0e27] font-bold' : ''}
                        ${line.includes('January 10') || line.includes('Jan 10') ? 'text-[#0a0e27] font-bold' : ''}
                        ${line.trim().startsWith('class ') || line.trim().startsWith('def ') || line.trim().startsWith('async def ') ? 'text-[#5FD35F]' : ''}
                        ${line.includes('"""') ? 'text-[#9FA4B8] italic' : ''}
                        ${!line.startsWith('#') && !line.includes('class ') && !line.includes('def ') && !line.includes('"""') && !line.includes('BUG FIX') && !line.includes('Performance') && line.trim() ? 'text-[#A8E6CF]' : ''}
                        ${isInHighlightSection && !isPerformanceLine ? 'opacity-100' : ''}
                        ${!isInHighlightSection && lineNumber > 50 ? 'opacity-40' : ''}
                      `}
                    >
                      {line || ' '}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#252a4a] px-6 py-3 border-t border-[#2a3050] flex items-center justify-between">
          <span className="text-xs text-[#6B7280]">UTF-8 • Plain Text</span>
          <motion.div
            className="flex items-center gap-2 text-xs text-[#5FD35F]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-[#5FD35F]" />
            Context Loaded
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
