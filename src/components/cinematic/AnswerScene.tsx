'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface AnswerSceneProps {
  isActive?: boolean;
}

export function AnswerScene({ isActive = true }: AnswerSceneProps) {
  if (!isActive) return null;

  const fullText = "Database query performance improved from 450ms to 120ms (73% faster). The bug fix was implemented on January 10, 2025 in the connection pool optimization.";
  const [displayText, setDisplayText] = useState('');
  const [showHighlight, setShowHighlight] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowHighlight(true), 300);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const highlightWords = ['450ms to 120ms', '73% faster', 'January 10, 2025'];
  
  const renderTextWithHighlights = () => {
    if (!showHighlight) {
      return <span className="text-[#E5E5E5]">{displayText}</span>;
    }

    const parts = [];
    let remainingText = fullText;
    
    highlightWords.forEach((word, idx) => {
      const index = remainingText.indexOf(word);
      if (index !== -1) {
        if (index > 0) {
          parts.push(
            <span key={`text-${idx}`} className="text-[#E5E5E5]">
              {remainingText.slice(0, index)}
            </span>
          );
        }
        parts.push(
          <motion.span
            key={`highlight-${idx}`}
            initial={{ backgroundColor: 'transparent' }}
            animate={{ backgroundColor: '#FFFF00' }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className="text-[#0a0e27] font-bold px-1 rounded"
          >
            {word}
          </motion.span>
        );
        remainingText = remainingText.slice(index + word.length);
      }
    });
    
    if (remainingText) {
      parts.push(
        <span key="text-final" className="text-[#E5E5E5]">
          {remainingText}
        </span>
      );
    }
    
    return parts;
  };

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
        className="w-full max-w-3xl px-8"
      >
        {/* Success Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5FD35F]/10 border border-[#5FD35F]/30 mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircle2 className="w-4 h-4 text-[#5FD35F]" />
            <span className="text-sm text-[#5FD35F] font-medium">Answer Synthesized</span>
          </motion.div>
          
          <div className="text-xs text-[#9FA4B8] font-mono">
            Answer synthesized via 3 recursive calls
          </div>
        </motion.div>

        {/* Answer Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
          className="bg-gradient-to-br from-[#5FD35F]/20 to-[#5FD35F]/5 rounded-2xl border-2 border-[#5FD35F]/50 p-8 shadow-2xl shadow-[#5FD35F]/10"
        >
          <div className="flex items-start gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
              className="w-12 h-12 rounded-full bg-[#5FD35F] flex items-center justify-center flex-shrink-0"
            >
              <CheckCircle2 className="w-6 h-6 text-[#0a0e27]" />
            </motion.div>
            
            <div className="flex-1">
              <div className="text-2xl text-[#E5E5E5] leading-relaxed font-mono">
                {displayText.length < fullText.length ? (
                  <span className="text-[#E5E5E5]">{displayText}</span>
                ) : (
                  renderTextWithHighlights()
                )}
                {displayText.length < fullText.length && (
                  <motion.span
                    className="inline-block w-1 h-8 bg-[#58C4DC] ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.4 }}
          className="mt-8 pt-6 border-t border-[#2a3050] grid grid-cols-3 gap-4 text-center"
        >
          <div>
            <div className="text-2xl font-bold text-[#5FD35F]">3</div>
            <div className="text-xs text-[#9FA4B8]">Recursive Calls</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#58C4DC]">1,247</div>
            <div className="text-xs text-[#9FA4B8]">Context Characters</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#FFFF00]">1.2s</div>
            <div className="text-xs text-[#9FA4B8]">Total Time</div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
