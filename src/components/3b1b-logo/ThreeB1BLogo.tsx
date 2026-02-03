'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ThreeB1BLogoProps {
  className?: string;
  size?: number;
}

export function ThreeB1BLogo({ className = '', size = 24 }: ThreeB1BLogoProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      initial="initial"
      whileHover="hover"
    >
      {/* Animated spiral representing 3Blue1Brown style */}
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        variants={{
          initial: { pathLength: 0, opacity: 0 },
          hover: { pathLength: 1, opacity: 1 }
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      
      {/* Inner spiral */}
      <motion.path
        d="M50 50 m-35,0 a35,35 0 1,0 70,0 a35,35 0 1,0 -70,0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        variants={{
          initial: { rotate: 0 },
          hover: { rotate: 360 }
        }}
        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
        style={{ transformOrigin: "50px 50px" }}
      />
      
      {/* Center dot */}
      <motion.circle
        cx="50"
        cy="50"
        r="8"
        fill="currentColor"
        variants={{
          initial: { scale: 0 },
          hover: { scale: 1 }
        }}
        transition={{ duration: 0.3, delay: 0.5 }}
      />
      
      {/* 3B1B text representation */}
      <motion.text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
        fontFamily="monospace"
        variants={{
          initial: { opacity: 0 },
          hover: { opacity: 1 }
        }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        3B1B
      </motion.text>
    </motion.svg>
  );
}

export default ThreeB1BLogo;
