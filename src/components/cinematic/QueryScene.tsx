'use client';

import { motion } from 'framer-motion';
import { EXAMPLE_QUERY } from './types';
import { Terminal, ChevronRight } from 'lucide-react';

export function QueryScene() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center bg-[#0a0e27]"
      style={{ zIndex: 30 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
        className="w-[600px] bg-[#1a1f3a] rounded-xl border border-[#2a3050] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-[#252a4a] px-5 py-3 flex items-center gap-2 border-b border-[#2a3050]">
          <div className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
          <div className="w-3 h-3 rounded-full bg-[#FFFF00]" />
          <div className="w-3 h-3 rounded-full bg-[#5FD35F]" />
          <span className="text-xs text-[#9FA4B8] ml-2 font-mono">RLM REPL</span>
        </div>

        <div className="p-8 font-mono">
          {/* Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center gap-2 text-[#58C4DC] mb-6"
          >
            <ChevronRight className="w-4 h-4" />
            <span className="text-sm">user_query</span>
            <span className="text-[#6B7280]">=</span>
          </motion.div>

          {/* Query Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-[#0a0e27] rounded-lg border-2 border-[#58C4DC]/50 p-6 mb-6"
          >
            <div className="flex items-start gap-3">
              <Terminal className="w-5 h-5 text-[#58C4DC] mt-1 flex-shrink-0" />
              <p className="text-lg text-[#A8E6CF] leading-relaxed">
                {EXAMPLE_QUERY}
              </p>
            </div>
          </motion.div>

          {/* Processing Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="flex items-center gap-3 text-[#9FA4B8]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-[#58C4DC] border-t-transparent rounded-full"
            />
            <span className="text-sm">Analyzing query intent...</span>
          </motion.div>

          {/* Code Preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="mt-6 pt-6 border-t border-[#2a3050]"
          >
            <div className="text-xs text-[#6B7280] mb-3">Generated Strategy:</div>
            <div className="bg-[#0a0e27] rounded p-4 text-xs text-[#9FA4B8] font-mono space-y-1">
              <div><span className="text-[#58C4DC]">def</span> <span className="text-[#FFFF00]">process_query</span>(query, context):</div>
              <div className="pl-4"><span className="text-[#6B7280]"># Step 1: Search for performance metrics</span></div>
              <div className="pl-4">matches = grep(context, <span className="text-[#5FD35F]">"performance|query time"</span>)</div>
              <div className="pl-4"><span className="text-[#6B7280]"># Step 2: Analyze code sections recursively</span></div>
              <div className="pl-4">results = [sub_llm(chunk) <span className="text-[#58C4DC]">for</span> chunk <span className="text-[#58C4DC]">in</span> matches]</div>
              <div className="pl-4"><span className="text-[#58C4DC]">return</span> synthesize(results)</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
