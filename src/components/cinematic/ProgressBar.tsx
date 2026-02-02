'use client';

import React, { useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface SceneSegment {
  id: number;
  duration: number;
  startTime: number;
  title: string;
}

export interface ProgressBarProps {
  scenes: SceneSegment[];
  currentScene: number;
  progress: number;
  totalDuration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  onSceneClick: (sceneId: number) => void;
  isPlaying: boolean;
  className?: string;
}

export function ProgressBar({
  scenes,
  currentScene,
  progress,
  totalDuration,
  currentTime,
  onSeek,
  onSceneClick,
  isPlaying,
  className,
}: ProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const targetTime = percentage * totalDuration;

      onSeek(targetTime);
    },
    [onSeek, totalDuration]
  );

  const handleTouch = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!progressBarRef.current) return;

      const touch = e.touches[0];
      const rect = progressBarRef.current.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, touchX / rect.width));
      const targetTime = percentage * totalDuration;

      onSeek(targetTime);
    },
    [onSeek, totalDuration]
  );

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Time display */}
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(totalDuration)}</span>
      </div>

      {/* Progress bar container */}
      <div
        ref={progressBarRef}
        className="relative h-3 bg-gray-200 rounded-full cursor-pointer group"
        onClick={handleProgressClick}
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        role="slider"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Animation progress"
        tabIndex={0}
      >
        {/* Scene segments */}
        {scenes.map((scene, index) => {
          const left = (scene.startTime / totalDuration) * 100;
          const width = (scene.duration / totalDuration) * 100;
          const isActive = scene.id === currentScene;
          const isPast = scene.startTime + scene.duration <= currentTime;

          return (
            <div
              key={scene.id}
              className={cn(
                'absolute top-0 h-full transition-all duration-150',
                isActive && 'bg-blue-500',
                isPast && !isActive && 'bg-blue-300',
                !isActive && !isPast && 'bg-gray-300',
                'first:rounded-l-full last:rounded-r-full'
              )}
              style={{
                left: `${left}%`,
                width: `${width}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSceneClick(scene.id);
              }}
            />
          );
        })}

        {/* Progress indicator */}
        <div
          className={cn(
            'absolute top-0 h-full bg-blue-600 rounded-full transition-all',
            isPlaying ? 'duration-75' : 'duration-150'
          )}
          style={{ width: `${progress}%` }}
        />

        {/* Scene boundaries */}
        {scenes.slice(1).map((scene) => {
          const left = (scene.startTime / totalDuration) * 100;
          return (
            <div
              key={`boundary-${scene.id}`}
              className="absolute top-0 w-0.5 h-full bg-white/50"
              style={{ left: `${left}%` }}
            />
          );
        })}

        {/* Hover tooltip */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none">
          Click to seek
        </div>
      </div>

      {/* Scene dots */}
      <div className="flex justify-between mt-3 px-1">
        {scenes.map((scene) => {
          const isActive = scene.id === currentScene;
          const isPast = scene.startTime + scene.duration <= currentTime;

          return (
            <button
              key={`dot-${scene.id}`}
              onClick={() => onSceneClick(scene.id)}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400',
                isActive && 'bg-blue-600 scale-125 ring-2 ring-blue-200',
                isPast && !isActive && 'bg-blue-400',
                !isActive && !isPast && 'bg-gray-300 hover:bg-gray-400'
              )}
              aria-label={`Scene ${scene.id}: ${scene.title}`}
              title={`Scene ${scene.id}: ${scene.title}`}
            />
          );
        })}
      </div>

      {/* Scene labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {scenes.map((scene) => (
          <span
            key={`label-${scene.id}`}
            className={cn(
              'transition-colors duration-200',
              scene.id === currentScene && 'text-blue-600 font-medium'
            )}
          >
            {scene.id}
          </span>
        ))}
      </div>
    </div>
  );
}
