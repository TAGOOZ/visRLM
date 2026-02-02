'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useSceneTimer } from '@/hooks/useSceneTimer';
import { ProgressBar } from './ProgressBar';
import voiceoverManifest from '@/data/voiceover-manifest.json';

export interface SceneControllerProps {
  className?: string;
  onSceneChange?: (sceneId: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  autoPlay?: boolean;
}

export interface SceneControllerState {
  currentScene: number;
  progress: number;
  isPlaying: boolean;
  isMuted: boolean;
  isLoading: boolean;
}

export function SceneController({
  className,
  onSceneChange,
  onPlayStateChange,
  autoPlay = false,
}: SceneControllerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const sceneTimerRef = useRef<ReturnType<typeof useSceneTimer> | null>(null);
  const audioManagerRef = useRef<ReturnType<typeof useAudioManager> | null>(null);

  // Parse manifest data
  const scenes = voiceoverManifest.scenes.map((scene) => ({
    id: scene.id,
    duration: scene.duration,
    startTime: scene.startTime,
    title: scene.title,
  }));

  const totalDuration = voiceoverManifest.totalDuration;

  // Scene timer
  const sceneTimer = useSceneTimer(scenes, totalDuration);
  sceneTimerRef.current = sceneTimer;

  // Audio manager with callbacks
  const audioManager = useAudioManager({
    onSceneComplete: useCallback(() => {
      console.log('Audio scene complete');
    }, []),
    onTimeUpdate: useCallback((currentTime: number) => {
      if (sceneTimerRef.current) {
        const timeDiff = Math.abs(currentTime - sceneTimerRef.current.totalElapsedTime);
        if (timeDiff > 0.1) {
          sceneTimerRef.current.seekToTime(currentTime);
        }
      }
    }, []),
    onLoad: useCallback(() => {
      console.log('Audio loaded');
    }, []),
    onError: useCallback((error: string) => {
      console.error('Audio error:', error);
    }, []),
  });
  audioManagerRef.current = audioManager;

  // Define callbacks that use audioManager via ref
  const togglePlayPause = useCallback(() => {
    if (sceneTimer.isRunning) {
      sceneTimer.pause();
    } else {
      if (sceneTimer.totalElapsedTime >= totalDuration) {
        sceneTimer.stop();
        sceneTimer.start();
      } else {
        sceneTimer.resume();
      }
    }
  }, [sceneTimer, totalDuration]);

  const seekToScene = useCallback(
    (sceneId: number) => {
      sceneTimer.jumpToScene(sceneId);
      // Load audio for the new scene
      const sceneData = voiceoverManifest.scenes.find((s) => s.id === sceneId);
      if (sceneData && audioManagerRef.current) {
        audioManagerRef.current.loadAudio(sceneData.audioFile);
      }
    },
    [sceneTimer]
  );

  const seekToTime = useCallback(
    (time: number) => {
      sceneTimer.seekToTime(time);
      if (audioManagerRef.current) {
        audioManagerRef.current.seek(time);
      }
    },
    [sceneTimer]
  );

  const toggleMute = useCallback(() => {
    if (audioManagerRef.current) {
      audioManagerRef.current.toggleMute();
    }
  }, []);

  // Load audio when scene changes
  useEffect(() => {
    const currentSceneData = voiceoverManifest.scenes.find(
      (s) => s.id === sceneTimer.currentScene
    );
    if (currentSceneData && audioManagerRef.current) {
      audioManagerRef.current.loadAudio(currentSceneData.audioFile);
    }
  }, [sceneTimer.currentScene]);

  // Sync audio playback with timer
  useEffect(() => {
    if (!audioManagerRef.current) return;
    
    if (sceneTimer.isRunning && audioManagerRef.current.isReady && !audioManagerRef.current.isPlaying) {
      audioManagerRef.current.play();
    } else if (!sceneTimer.isRunning && audioManagerRef.current.isPlaying) {
      audioManagerRef.current.pause();
    }
  }, [sceneTimer.isRunning, audioManager.isReady, audioManager.isPlaying]);

  // Notify scene changes
  useEffect(() => {
    onSceneChange?.(sceneTimer.currentScene);
  }, [sceneTimer.currentScene, onSceneChange]);

  // Notify play state changes
  useEffect(() => {
    onPlayStateChange?.(sceneTimer.isRunning);
  }, [sceneTimer.isRunning, onPlayStateChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekToScene(Math.max(1, sceneTimer.currentScene - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekToScene(Math.min(scenes.length, sceneTimer.currentScene + 1));
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sceneTimer.currentScene, scenes.length, togglePlayPause, seekToScene, toggleMute]);

  // Auto-play on mount if enabled
  useEffect(() => {
    if (autoPlay && !isInitialized) {
      setIsInitialized(true);
      // Use setTimeout to avoid circular dependency
      setTimeout(() => {
        if (sceneTimer.totalElapsedTime >= totalDuration) {
          sceneTimer.stop();
          sceneTimer.start();
        } else {
          sceneTimer.resume();
        }
      }, 0);
    }
  }, [autoPlay, isInitialized, sceneTimer, totalDuration]);

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-lg p-4 space-y-4',
        className
      )}
    >
      {/* Progress bar */}
      <ProgressBar
        scenes={scenes}
        currentScene={sceneTimer.currentScene}
        progress={sceneTimer.progress}
        totalDuration={totalDuration}
        currentTime={sceneTimer.totalElapsedTime}
        onSeek={seekToTime}
        onSceneClick={seekToScene}
        isPlaying={sceneTimer.isRunning}
      />

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Play/Pause button */}
        <button
          onClick={togglePlayPause}
          disabled={audioManager.isLoading}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
            'focus:outline-none focus:ring-2 focus:ring-blue-400',
            audioManager.isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          )}
          aria-label={sceneTimer.isRunning ? 'Pause' : 'Play'}
        >
          {audioManager.isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Loading...</span>
            </>
          ) : sceneTimer.isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Play</span>
            </>
          )}
        </button>

        {/* Scene info */}
        <div className="text-center flex-1 px-4">
          <div className="text-sm font-medium text-gray-900">
            Scene {sceneTimer.currentScene}:{' '}
            {voiceoverManifest.scenes.find((s) => s.id === sceneTimer.currentScene)?.title}
          </div>
          <div className="text-xs text-gray-500">
            {Math.round(sceneTimer.sceneProgress)}% complete
          </div>
        </div>

        {/* Volume/Mute button */}
        <button
          onClick={toggleMute}
          className={cn(
            'p-2 rounded-lg transition-all',
            'focus:outline-none focus:ring-2 focus:ring-blue-400',
            audioManager.isMuted
              ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
          aria-label={audioManager.isMuted ? 'Unmute' : 'Mute'}
          title={audioManager.isMuted ? 'Unmute (M)' : 'Mute (M)'}
        >
          {audioManager.isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Error message */}
      {audioManager.error && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
          Error: {audioManager.error}
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="text-xs text-gray-400 text-center">
        Space: Play/Pause • ←/→: Previous/Next Scene • M: Mute
      </div>
    </div>
  );
}
