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
    <div className="absolute bottom-0 left-0 right-0 bg-[#0a0e27]/95 border-t border-[#2a3050] p-4">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
        <div className="h-2 bg-[#1a1f3a] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#58C4DC] to-[#5FD35F] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentTime / totalDuration) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="text-[#9FA4B8] hover:text-[#58C4DC] hover:bg-[#1a1f3a]"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSceneChange(Math.max(0, currentScene - 1))}
            className="text-[#9FA4B8] hover:text-[#58C4DC] hover:bg-[#1a1f3a]"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onPlayPause}
            className={`${isPlaying ? 'text-[#FFFF00]' : 'text-[#58C4DC]'} hover:bg-[#1a1f3a]`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSceneChange(Math.min(scenes.length - 1, currentScene + 1))}
            className="text-[#9FA4B8] hover:text-[#58C4DC] hover:bg-[#1a1f3a]"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Scene Indicators */}
        <div className="flex items-center gap-1">
          {scenes.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => onSceneChange(idx)}
              className="group relative"
            >
              <div
                className={`
                  w-12 h-8 rounded flex items-center justify-center text-xs font-mono transition-all
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
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#1a1f3a] border border-[#2a3050] rounded text-xs text-[#9FA4B8] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {scene.title}: {scene.description}
              </div>
            </button>
          ))}
        </div>

        {/* Current Scene Info */}
        <div className="text-right">
          <div className="text-sm text-[#58C4DC] font-medium">
            Scene {currentScene + 1}: {scenes[currentScene]?.title}
          </div>
          <div className="text-xs text-[#6B7280]">
            {scenes[currentScene]?.description}
          </div>
        </div>
      </div>
    </div>
  );
}
