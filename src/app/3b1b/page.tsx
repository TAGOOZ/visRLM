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
    
  }, [currentScene, isPlaying, isMuted]);

  // Scene timer - advances scenes based on audio duration
  useEffect(() => {
    if (!isPlaying) return;

    const sceneData = getSceneData(currentScene);
    const sceneDuration = sceneData.duration * 1000; // Convert to ms (using actual audio duration)
    const interval = 100; // Update every 100ms
    
    let elapsed = sceneProgress * sceneDuration;
    sceneStartTimeRef.current = Date.now();

    console.log(`⏱ Scene ${currentScene + 1}: Starting timer (${sceneDuration}ms)`);

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const actualElapsed = now - sceneStartTimeRef.current;
      const progress = Math.min(actualElapsed / sceneDuration, 1);
      
      setSceneProgress(progress);

      // Check if scene should end
      if (actualElapsed >= sceneDuration) {
        console.log(`⏱ Scene ${currentScene + 1}: Timer complete`);
        
        if (currentScene < scenes.length - 1) {
          // Move to next scene
          console.log(`→ Scene ${currentScene + 1} → Scene ${currentScene + 2}`);
          setCurrentScene(prev => prev + 1);
          setSceneProgress(0);
        } else {
          // End of all scenes
          console.log('🏁 Animation complete');
          setIsPlaying(false);
          setSceneProgress(1);
        }
      }
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
    <div className="w-full h-screen bg-[#0a0e27] overflow-hidden relative">
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

      {/* Main Container - 900x600 centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-[900px] h-[600px] bg-[#0a0e27] rounded-lg overflow-hidden shadow-2xl"
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
              className="absolute inset-0"
            >
              <CurrentSceneComponent />
            </motion.div>
          </AnimatePresence>

          {/* Scene Label Overlay */}
          <div className="absolute top-4 left-4 z-[100]">
            <div className="px-3 py-1.5 rounded bg-[#1a1f3a]/80 border border-[#2a3050] text-xs">
              <span className="text-[#58C4DC] font-mono">
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

      {/* Header Info */}
      <div className="absolute top-6 left-6 z-[100]">
        <h1 className="text-xl font-bold text-white">
          RLMs <span className="text-[#58C4DC]">Explained</span>
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          3Blue1Brown Style Visualization {isMuted && '🔇'}
        </p>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="absolute top-6 right-6 z-[100]">
        <div className="bg-[#1a1f3a]/80 border border-[#2a3050] rounded-lg p-3 text-xs text-[#6B7280]">
          <div className="space-y-1">
            <div><span className="text-[#9FA4B8]">Space</span> Play/Pause</div>
            <div><span className="text-[#9FA4B8]">← →</span> Prev/Next Scene</div>
            <div><span className="text-[#9FA4B8]">R</span> Reset</div>
            <div><span className="text-[#9FA4B8]">M</span> Mute/Unmute</div>
          </div>
        </div>
      </div>
    </div>
  );
}
