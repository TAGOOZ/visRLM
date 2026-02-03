'use client';

import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { scenes, type Scene } from './types';
import { Button } from '@/components/ui/button';

interface TimelineControlsProps {
  currentScene: number;
  isPlaying: boolean;
  onSceneChange: (sceneIndex: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
  progress: number;
}

export function TimelineControls({
  currentScene,
  isPlaying,
  onSceneChange,
  onPlayPause,
  onReset,
  progress,
}: TimelineControlsProps) {
  const totalDuration = scenes.reduce((acc, scene) => acc + scene.duration, 0);
  const currentTime = scenes.slice(0, currentScene).reduce((acc, scene) => acc + scene.duration, 0) + 
    (progress * scenes[currentScene]?.duration || 0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#0a0e27]/95 border-t border-[#2a3050] p-2 sm:p-4">
      {/* Progress Bar */}
      <div className="mb-2 sm:mb-4">
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-[#6B7280] mb-1 sm:mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
        <div className="h-1.5 sm:h-2 bg-[#1a1f3a] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#58C4DC] to-[#5FD35F] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentTime / totalDuration) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Playback Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="text-[#9FA4B8] hover:text-[#58C4DC] hover:bg-[#1a1f3a] h-8 w-8 sm:h-10 sm:w-10"
          >
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSceneChange(Math.max(0, currentScene - 1))}
            className="text-[#9FA4B8] hover:text-[#58C4DC] hover:bg-[#1a1f3a] h-8 w-8 sm:h-10 sm:w-10"
          >
            <SkipBack className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onPlayPause}
            className={`${isPlaying ? 'text-[#FFFF00]' : 'text-[#58C4DC]'} hover:bg-[#1a1f3a] h-8 w-8 sm:h-10 sm:w-10`}
          >
            {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSceneChange(Math.min(scenes.length - 1, currentScene + 1))}
            className="text-[#9FA4B8] hover:text-[#58C4DC] hover:bg-[#1a1f3a] h-8 w-8 sm:h-10 sm:w-10"
          >
            <SkipForward className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>

        {/* Scene Indicators - Responsive */}
        <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto max-w-[40%] sm:max-w-none scrollbar-hide">
          {scenes.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => onSceneChange(idx)}
              className="group relative flex-shrink-0"
            >
              <div
                className={`
                  w-6 h-5 sm:w-10 sm:h-7 md:w-12 md:h-8 rounded flex items-center justify-center text-[10px] sm:text-xs font-mono transition-all
                  ${idx === currentScene 
                    ? 'bg-[#58C4DC] text-[#0a0e27]' 
                    : idx < currentScene
                      ? 'bg-[#5FD35F]/30 text-[#5FD35F]'
                      : 'bg-[#1a1f3a] text-[#6B7280] hover:bg-[#2a3050]'
                  }
                `}
              >
                {idx + 1}
              </div>
              
              {/* Tooltip - Hidden on mobile */}
              <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#1a1f3a] border border-[#2a3050] rounded text-xs text-[#9FA4B8] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {scene.title}
              </div>
            </button>
          ))}
        </div>

        {/* Current Scene Info - Responsive */}
        <div className="text-right hidden sm:block">
          <div className="text-xs sm:text-sm text-[#58C4DC] font-medium">
            Scene {currentScene + 1}: {scenes[currentScene]?.title}
          </div>
          <div className="text-[10px] sm:text-xs text-[#6B7280]">
            {scenes[currentScene]?.description}
          </div>
        </div>

        {/* Mobile Scene Info */}
        <div className="text-right sm:hidden">
          <div className="text-[10px] text-[#58C4DC] font-medium">
            {currentScene + 1}/{scenes.length}
          </div>
        </div>
      </div>
    </div>
  );
}
