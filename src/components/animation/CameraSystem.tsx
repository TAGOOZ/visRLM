'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, useAnimation } from 'framer-motion';

export type CameraState = 
  | 'overview'      // God's eye view
  | 'repl'          // Zoomed into REPL
  | 'code-line'     // Specific line of code
  | 'tree'          // Execution tree view
  | 'node'          // Inside a sub-LLM node
  | 'chunk'         // Context chunk detail
  | 'synthesis';    // Results aggregating

interface CameraPosition {
  scale: number;
  x: number;
  y: number;
  opacity?: number;
}

const cameraPositions: Record<CameraState, CameraPosition> = {
  overview: { scale: 1, x: 0, y: 0, opacity: 1 },
  repl: { scale: 2.5, x: -300, y: 100, opacity: 1 },
  'code-line': { scale: 5, x: -800, y: -200, opacity: 1 },
  tree: { scale: 1.8, x: 200, y: -150, opacity: 1 },
  node: { scale: 6, x: -1200, y: -800, opacity: 1 },
  chunk: { scale: 4, x: -600, y: -400, opacity: 1 },
  synthesis: { scale: 1.2, x: 0, y: -100, opacity: 1 },
};

interface CameraContextType {
  currentState: CameraState;
  controls: ReturnType<typeof useAnimation>;
  zoomTo: (state: CameraState, duration?: number) => Promise<void>;
  zoomSequence: (states: CameraState[], durations?: number[]) => Promise<void>;
  reset: () => Promise<void>;
  isAnimating: boolean;
}

const CameraContext = createContext<CameraContextType | null>(null);

export const useCamera = () => {
  const context = useContext(CameraContext);
  if (!context) throw new Error('useCamera must be used within CameraProvider');
  return context;
};

interface CameraProviderProps {
  children: ReactNode;
}

export const CameraProvider: React.FC<CameraProviderProps> = ({ children }) => {
  const [currentState, setCurrentState] = useState<CameraState>('overview');
  const [isAnimating, setIsAnimating] = useState(false);
  const controls = useAnimation();

  const zoomTo = async (state: CameraState, duration = 1.5) => {
    setIsAnimating(true);
    setCurrentState(state);
    
    const position = cameraPositions[state];
    
    await controls.start({
      scale: position.scale,
      x: position.x,
      y: position.y,
      opacity: position.opacity,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
        duration,
      },
    });
    
    setIsAnimating(false);
  };

  const zoomSequence = async (states: CameraState[], durations?: number[]) => {
    for (let i = 0; i < states.length; i++) {
      await zoomTo(states[i], durations?.[i] || 1.5);
      // Small pause between zooms
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  const reset = async () => {
    await zoomTo('overview', 1);
  };

  return (
    <CameraContext.Provider
      value={{
        currentState,
        controls,
        zoomTo,
        zoomSequence,
        reset,
        isAnimating,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};

// Animated container that responds to camera
export const AnimatedViewport: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { controls } = useCamera();
  
  return (
    <motion.div
      animate={controls}
      initial={{ scale: 1, x: 0, y: 0 }}
      style={{
        width: '100%',
        height: '100%',
        transformOrigin: 'center center',
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  );
};

// Highlight component that dims everything except target
export const Spotlight: React.FC<{
  targetId: string;
  children: ReactNode;
  active: boolean;
}> = ({ targetId, children, active }) => {
  return (
    <div style={{ position: 'relative' }}>
      {/* Dimmed background */}
      <motion.div
        animate={{ opacity: active ? 0.3 : 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: active ? 'rgba(10, 14, 39, 0.8)' : 'transparent',
          pointerEvents: active ? 'none' : 'auto',
          zIndex: active ? 10 : 0,
        }}
      />
      
      {/* Highlighted content */}
      <motion.div
        animate={{
          filter: active ? 'brightness(1.2)' : 'brightness(1)',
          zIndex: active ? 20 : 1,
        }}
        transition={{ duration: 0.5 }}
        id={targetId}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Morphing transition component
export const MorphingTransition: React.FC<{
  from: ReactNode;
  to: ReactNode;
  isActive: boolean;
  duration?: number;
}> = ({ from, to, isActive, duration = 1 }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <motion.div
        animate={{
          opacity: isActive ? 0 : 1,
          scale: isActive ? 0.8 : 1,
          rotateY: isActive ? -90 : 0,
        }}
        transition={{ duration, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        {from}
      </motion.div>
      
      <motion.div
        animate={{
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 1.2,
          rotateY: isActive ? 0 : 90,
        }}
        transition={{ duration, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        {to}
      </motion.div>
    </div>
  );
};

// Chapter marker type
export interface Chapter {
  id: string;
  label: string;
  timestamp: number; // in seconds
  state: CameraState;
}

// Predefined chapters for RLM demo
export const rlmChapters: Chapter[] = [
  { id: 'intro', label: 'The Problem', timestamp: 0, state: 'overview' },
  { id: 'repl', label: 'REPL Strategy', timestamp: 15, state: 'repl' },
  { id: 'decomposition', label: 'Breaking Down', timestamp: 35, state: 'code-line' },
  { id: 'tree', label: 'Execution Tree', timestamp: 55, state: 'tree' },
  { id: 'node', label: 'Inside Sub-LLM', timestamp: 75, state: 'node' },
  { id: 'parallel', label: 'Parallel Processing', timestamp: 95, state: 'tree' },
  { id: 'aggregation', label: 'Results Flow', timestamp: 115, state: 'synthesis' },
  { id: 'result', label: 'Final Answer', timestamp: 130, state: 'overview' },
];
