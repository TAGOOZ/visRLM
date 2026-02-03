'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TitleScene,
  ContextScene,
  QueryScene,
  TreeScene,
  DetailScene,
  AnswerScene,
  TimelineControls,
  scenes,
} from '@/components/cinematic';
import voiceoverManifest from '@/data/voiceover-manifest.json';

// Scene component mapping
const sceneComponents: Record<string, React.FC> = {
  title: TitleScene,
  context: ContextScene,
  query: QueryScene,
  tree: TreeScene,
  detail: DetailScene,
  answer: AnswerScene,
};

// Combine scene data from types.ts with audio manifest
const getSceneData = (sceneIndex: number) => {
  return {
    ...scenes[sceneIndex],
    ...voiceoverManifest.scenes[sceneIndex],
  };
};

export default function CinematicRLM() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sceneStartTimeRef = useRef<number>(0);
  const audioEndedHandlerRef = useRef<(() => void) | null>(null);

  const currentSceneData = scenes[currentScene];
  const currentManifestData = getSceneData(currentScene);
  const CurrentSceneComponent = sceneComponents[currentSceneData?.visibleLayer || 'title'];

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = 1;
      audioRef.current.crossOrigin = 'anonymous';
      
      // Log audio events for debugging
      const audio = audioRef.current;
      
      audio.addEventListener('canplay', () => {
        console.log('✓ Audio can play:', audio.src);
      });
      
      audio.addEventListener('playing', () => {
        console.log('▶ Audio playing:', audio.src);
      });
      
      audio.addEventListener('ended', () => {
        console.log('⏹ Audio ended:', audio.src);
      });
      
      audio.addEventListener('error', () => {
        const error = audio.error;
        console.error('❌ Audio error:', {
          message: error?.message || 'Unknown error',
          code: error?.code,
          src: audio.src || '(no src set)',
          networkState: audio.networkState,
          readyState: audio.readyState,
        });
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Master audio/slide sync effect - handles BOTH loading and timing
  useEffect(() => {
    if (!audioRef.current) return;
    
    const sceneData = getSceneData(currentScene);
    const audioFile = sceneData.audioFile;
    const sceneDuration = sceneData.duration; // Use actual audio duration from manifest
    
    console.log(`Scene ${currentScene + 1}: Loading "${sceneData.title}" (${sceneDuration.toFixed(1)}s) - ${audioFile}`);
    
    // Update camera for this scene
    if (currentSceneData?.camera) {
      setCamera(currentSceneData.camera);
    }

    // Remove previous ended handler
    if (audioEndedHandlerRef.current && audioRef.current) {
      audioRef.current.removeEventListener('ended', audioEndedHandlerRef.current);
    }

    // If not playing, just load the audio but don't play
    if (!isPlaying) {
      audioRef.current.src = audioFile;
      audioRef.current.muted = isMuted;
      audioRef.current.load();
      return;
    }

    // PLAYING: Load and play audio
    const playAudio = async () => {
      if (!audioRef.current) return;
      
      try {
        audioRef.current.src = audioFile;
        audioRef.current.muted = isMuted;
        audioRef.current.load();
        
        // Wait for canplay event before playing
        await new Promise<void>((resolve, reject) => {
          if (!audioRef.current) {
            reject(new Error('Audio element lost'));
            return;
          }
          
          const timeout = setTimeout(() => {
            reject(new Error('Timeout waiting for canplay'));
          }, 5000);
          
          const canplayHandler = () => {
            clearTimeout(timeout);
            if (audioRef.current) {
              audioRef.current.removeEventListener('canplay', canplayHandler);
              audioRef.current.removeEventListener('error', errorHandler);
            }
            resolve();
          };
          
          const errorHandler = () => {
            clearTimeout(timeout);
            if (audioRef.current) {
              audioRef.current.removeEventListener('canplay', canplayHandler);
              audioRef.current.removeEventListener('error', errorHandler);
            }
            reject(new Error('Failed to load audio'));
          };
          
          if (audioRef.current.readyState >= 3) {
            clearTimeout(timeout);
            resolve();
          } else {
            audioRef.current.addEventListener('canplay', canplayHandler, { once: true });
            audioRef.current.addEventListener('error', errorHandler, { once: true });
          }
        });
        
        // Now play
        await audioRef.current.play();
        console.log(`▶ Scene ${currentScene + 1}: Playing audio successfully`);
        
        // Add ended listener to advance to next scene when audio finishes
        const endedHandler = () => {
          console.log(`⏹ Scene ${currentScene + 1}: Audio ended naturally`);
          if (currentScene < scenes.length - 1) {
            console.log(`→ Scene ${currentScene + 1} → Scene ${currentScene + 2}`);
            setCurrentScene(prev => prev + 1);
            setSceneProgress(0);
          } else {
            console.log('🏁 Animation complete');
            setIsPlaying(false);
            setSceneProgress(1);
          }
        };
        
        audioEndedHandlerRef.current = endedHandler;
        audioRef.current.addEventListener('ended', endedHandler, { once: true });
        
      } catch (err) {
        console.error(`❌ Scene ${currentScene + 1}: Audio failed -`, err instanceof Error ? err.message : String(err));
        // Try playing without waiting for canplay
        if (audioRef.current) {
          try {
            audioRef.current.src = audioFile;
            audioRef.current.muted = isMuted;
            await audioRef.current.play();
            console.log(`▶ Scene ${currentScene + 1}: Playing on retry`);
          } catch (retryErr) {
            console.error(`❌ Scene ${currentScene + 1}: Retry failed -`, retryErr);
          }
        }
      }
    };
    
    playAudio();
    
    // Cleanup
    return () => {
      if (audioRef.current && audioEndedHandlerRef.current) {
        audioRef.current.removeEventListener('ended', audioEndedHandlerRef.current);
      }
    };
  }, [currentScene, isPlaying, isMuted]);

  // Scene timer - updates progress bar only (scene advancement handled by audio ended event)
  useEffect(() => {
    if (!isPlaying) return;

    const sceneData = getSceneData(currentScene);
    const sceneDuration = sceneData.duration * 1000; // Convert to ms (using actual audio duration)
    const interval = 100; // Update every 100ms
    
    sceneStartTimeRef.current = Date.now();

    console.log(`⏱ Scene ${currentScene + 1}: Starting progress timer (${sceneDuration}ms)`);

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const actualElapsed = now - sceneStartTimeRef.current;
      const progress = Math.min(actualElapsed / sceneDuration, 1);
      
      setSceneProgress(progress);
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentScene]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSceneChange(Math.max(0, currentScene - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSceneChange(Math.min(scenes.length - 1, currentScene + 1));
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleReset();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setIsMuted(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScene]);

  const handleSceneChange = useCallback((sceneIndex: number) => {
    console.log(`→ Manual scene change: ${currentScene + 1} → ${sceneIndex + 1}`);
    setCurrentScene(sceneIndex);
    setSceneProgress(0);
    setIsPlaying(false);
  }, [currentScene]);

  const handlePlayPause = useCallback(() => {
    console.log(isPlaying ? '⏸ Pausing' : '▶ Playing');
    setIsPlaying(prev => !prev);
  }, [isPlaying]);

  const handleReset = useCallback(() => {
    console.log('🔄 Resetting animation');
    setCurrentScene(0);
    setSceneProgress(0);
    setIsPlaying(false);
    setCamera({ x: 0, y: 0, zoom: 1 });
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return (
    <div className="w-full h-screen bg-[#0a0e27] overflow-hidden relative cinematic-container">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#58C4DC" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Container - Responsive */}
      <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 lg:p-6">
        <motion.div
          className="relative w-full max-w-[900px] aspect-[3/2] max-h-[80vh] sm:max-h-[85vh] bg-[#0a0e27] rounded-lg overflow-hidden shadow-2xl"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(88, 196, 220, 0.1)',
          }}
          animate={{
            scale: camera.zoom,
            x: camera.x,
            y: camera.y,
          }}
          transition={{
            duration: 0.5,
            ease: [0.42, 0, 0.58, 1],
          }}
        >
          {/* Scene Container - Only ONE scene visible at a time */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <CurrentSceneComponent />
            </motion.div>
          </AnimatePresence>

          {/* Scene Label Overlay */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-[100]">
            <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded bg-[#1a1f3a]/80 border border-[#2a3050] text-xs">
              <span className="text-[#58C4DC] font-mono text-[10px] sm:text-xs">
                Scene {currentScene + 1}/{scenes.length}: {currentManifestData.title}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timeline Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-[100]">
        <TimelineControls
          currentScene={currentScene}
          isPlaying={isPlaying}
          onSceneChange={handleSceneChange}
          onPlayPause={handlePlayPause}
          onReset={handleReset}
          progress={sceneProgress}
        />
      </div>

      {/* Header Info - Responsive */}
      <div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-[100]">
        <h1 className="text-base sm:text-xl font-bold text-white">
          RLMs <span className="text-[#58C4DC]">Explained</span>
        </h1>
        <p className="text-[10px] sm:text-xs text-[#6B7280] mt-0.5 sm:mt-1">
          3Blue1Brown Style Visualization {isMuted && '🔇'}
        </p>
      </div>

      {/* Keyboard Shortcuts Hint - Responsive */}
      <div className="absolute top-3 sm:top-6 right-3 sm:right-6 z-[100] hidden sm:block">
        <div className="bg-[#1a1f3a]/80 border border-[#2a3050] rounded-lg p-2 sm:p-3 text-[10px] sm:text-xs text-[#6B7280]">
          <div className="space-y-0.5 sm:space-y-1">
            <div><span className="text-[#9FA4B8]">Space</span> Play/Pause</div>
            <div><span className="text-[#9FA4B8]">← →</span> Prev/Next Scene</div>
            <div><span className="text-[#9FA4B8]">R</span> Reset</div>
            <div><span className="text-[#9FA4B8]">M</span> Mute/Unmute</div>
          </div>
        </div>
      </div>

      {/* Mobile Shortcuts Toggle */}
      <div className="absolute top-3 right-3 z-[100] sm:hidden">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="bg-[#1a1f3a]/80 border border-[#2a3050] rounded-lg p-2 text-xs text-[#6B7280]"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  );
}
