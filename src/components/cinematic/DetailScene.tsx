'use client';

import { motion } from 'framer-motion';
import { Cpu, ChevronRight } from 'lucide-react';

interface DetailSceneProps {
  isActive?: boolean;
}

export function DetailScene({ isActive = true }: DetailSceneProps) {
  if (!isActive) return null;

  const chunkLines = [
    '## 2. Database Connection Pool (Lines 86-145)',
    'class DatabasePool:',
    '    async def execute_query(self, sql: str, params: tuple):',
    '        ...',
    '    # BUG FIX (Jan 10): Added exponential backoff for retries',
    '    # Performance: Average query time reduced from 450ms to 120ms'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-[900px] h-[600px] flex items-center justify-center bg-[#0a0e27] relative overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
        className="w-[550px] bg-[#1a1f3a] rounded-xl border-2 border-[#58C4DC] overflow-hidden shadow-2xl shadow-[#58C4DC]/10"
      >
        {/* Header */}
        <div className="bg-[#252a4a] px-6 py-4 flex items-center gap-3 border-b border-[#58C4DC]/30">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <Cpu className="w-5 h-5 text-[#58C4DC]" />
          </motion.div>
          <span className="text-lg font-mono text-[#58C4DC]">Sub-LLM #2</span>
          <motion.div
            className="ml-auto px-3 py-1 rounded-full bg-[#58C4DC]/20 border border-[#58C4DC]/50 text-xs text-[#58C4DC]"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Processing
          </motion.div>
        </div>

        <div className="p-6 space-y-6">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 text-xs text-[#9FA4B8] mb-3">
              <ChevronRight className="w-3 h-3" />
              <span>Input Query</span>
            </div>
            <div className="bg-[#0a0e27] rounded-lg border border-[#2a3050] p-4">
              <div className="flex items-start gap-3">
                <span className="text-[#58C4DC] text-sm">{'>>>'}</span>
                <span className="text-sm text-[#E5E5E5] font-mono">
                  What was the performance improvement for database queries and when was the bug fix implemented?
                </span>
              </div>
            </div>
          </motion.div>

          {/* Context Chunk Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 text-xs text-[#9FA4B8] mb-3">
              <ChevronRight className="w-3 h-3" />
              <span>Assigned Chunk</span>
              <span className="text-[#6B7280] ml-auto">api_server.py [Database Pool]</span>
            </div>
            <div className="bg-[#0a0e27] rounded-lg border border-[#2a3050] p-4">
              <pre className="text-xs text-[#9FA4B8] font-mono whitespace-pre-wrap space-y-1">
                {chunkLines.map((line, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className={line.includes('450ms to 120ms') ? 'text-[#FFFF00] font-bold' : ''}
                  >
                    {line}
                  </motion.div>
                ))}
              </pre>
            </div>
          </motion.div>

          {/* Processing Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="flex items-center gap-4 py-4 border-y border-[#2a3050]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-6 h-6 border-[3px] border-[#58C4DC] border-t-transparent rounded-full"
            />
            <div className="flex-1">
              <div className="text-sm text-[#58C4DC] font-mono">Searching for performance metrics...</div>
              <div className="w-full h-1 bg-[#2a3050] rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full bg-[#58C4DC] rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </motion.div>

          {/* Result Section */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5, type: 'spring' }}
          >
            <div className="flex items-center gap-2 text-xs text-[#5FD35F] mb-3">
              <ChevronRight className="w-3 h-3" />
              <span>Result Found</span>
            </div>
            <div className="bg-[#5FD35F]/10 rounded-lg border border-[#5FD35F]/30 p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#5FD35F] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#0a0e27]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-sm text-[#E5E5E5] font-mono space-y-1">
                  <div>Performance: <span className="text-[#FFFF00]">450ms → 120ms</span></div>
                  <div>Bug Fix Date: <span className="text-[#FFFF00]">January 10, 2025</span></div>
                  <div>Improvement: <span className="text-[#FFFF00]">73% faster</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Stats */}
        <div className="bg-[#252a4a] px-6 py-3 border-t border-[#2a3050] flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-[#6B7280]">Tokens: <span className="text-[#9FA4B8]">287</span></span>
            <span className="text-[#6B7280]">Latency: <span className="text-[#9FA4B8]">185ms</span></span>
          </div>
          <div className="text-[#5FD35F]">Processing Complete</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
