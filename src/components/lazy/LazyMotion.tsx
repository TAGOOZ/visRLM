'use client';

import { useReducedMotion } from '@/hooks/useReducedMotion';

interface LazyMotionProps {
  children: React.ReactNode;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  className?: string;
  whileHover?: any;
  whileTap?: any;
  whileInView?: any;
  viewport?: any;
  key?: string;
}

// Wrapper that respects prefers-reduced-motion
export function LazyMotionDiv({
  children,
  initial,
  animate,
  exit,
  transition,
  className,
  whileHover,
  whileTap,
  whileInView,
  viewport,
  key,
}: LazyMotionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    // Render without animations when user prefers reduced motion
    return (
      <div key={key} className={className}>
        {children}
      </div>
    );
  }

  // Dynamically import motion only when needed
  const MotionDiv = require('framer-motion').motion.div;

  return (
    <MotionDiv
      key={key}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      className={className}
      whileHover={whileHover}
      whileTap={whileTap}
      whileInView={whileInView}
      viewport={viewport}
    >
      {children}
    </MotionDiv>
  );
}

// Lazy AnimatePresence wrapper
export function LazyAnimatePresence({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode?: 'sync' | 'async' | 'popLayout';
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  const AnimatePresence = require('framer-motion').AnimatePresence;

  return <AnimatePresence mode={mode}>{children}</AnimatePresence>;
}
