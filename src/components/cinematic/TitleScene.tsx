'use client';

import { motion } from 'framer-motion';

interface TitleSceneProps {
  isActive?: boolean;
}

export function TitleScene({ isActive = true }: TitleSceneProps) {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col items-center justify-center bg-[#0a0e27] relative overflow-hidden px-4"
    >
      {/* 3B1B Style Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.42, 0, 0.58, 1] }}
        className="text-center"
      >
        {/* Animated Logo Circle - Responsive */}
        <motion.div
          className="w-20 h-20 sm:w-28 md:w-32 mx-auto mb-4 sm:mb-6 md:mb-8 rounded-full border-4 border-[#58C4DC] flex items-center justify-center"
          animate={{ 
            rotate: 360,
            borderColor: ['#58C4DC', '#5FD35F', '#FFFF00', '#58C4DC']
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            borderColor: { duration: 4, repeat: Infinity }
          }}
        >
          <motion.div
            className="w-14 h-14 sm:w-20 md:w-24 rounded-full bg-gradient-to-br from-[#58C4DC] to-[#5FD35F]"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Title - Responsive */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          RLMs <span className="text-[#58C4DC]">Explained</span>
        </motion.h1>

        {/* Subtitle - Responsive */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-[#E5E5E5] mb-4 sm:mb-6 md:mb-8"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Recursive Language Models
        </motion.p>
      </motion.div>

      {/* Decorative Elements - Responsive */}
      <motion.div
        className="absolute bottom-8 sm:bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-[#9FA4B8]">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#58C4DC]" />
            <span>Recursive</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#5FD35F]" />
            <span>Intelligent</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FFFF00]" />
            <span>Efficient</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
