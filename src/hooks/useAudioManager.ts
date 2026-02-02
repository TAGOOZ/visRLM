'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export interface AudioManagerState {
  isPlaying: boolean;
  isLoading: boolean;
  isReady: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  error: string | null;
}

export interface AudioManagerCallbacks {
  onSceneComplete?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export interface UseAudioManagerReturn extends AudioManagerState {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  loadAudio: (src: string) => void;
}

export function useAudioManager(
  callbacks: AudioManagerCallbacks = {}
): UseAudioManagerReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const callbacksRef = useRef(callbacks);
  const [state, setState] = useState<AudioManagerState>({
    isPlaying: false,
    isLoading: false,
    isReady: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    error: null,
  });

  // Update callbacks ref on each render
  useEffect(() => {
    callbacksRef.current = callbacks;
  });

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;
      setState((prev) => ({ ...prev, currentTime }));
      callbacksRef.current.onTimeUpdate?.(currentTime);
    };

    const handleLoadedMetadata = () => {
      setState((prev) => ({
        ...prev,
        duration: audio.duration,
        isLoading: false,
        isReady: true,
        error: null,
      }));
      callbacksRef.current.onLoad?.();
    };

    const handleEnded = () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
      callbacksRef.current.onSceneComplete?.();
    };

    const handleError = () => {
      const errorMsg = 'Failed to load audio file';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
        isReady: false,
      }));
      callbacksRef.current.onError?.(errorMsg);
    };

    const handleCanPlay = () => {
      setState((prev) => ({ ...prev, isLoading: false, isReady: true }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
      audio.src = '';
    };
  }, []); // Empty dependency array - only run once

  const loadAudio = useCallback((src: string) => {
    if (!audioRef.current) return;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      isReady: false,
      error: null,
    }));

    audioRef.current.src = src;
    audioRef.current.load();
  }, []);

  const play = useCallback(() => {
    if (!audioRef.current || !state.isReady) return;

    audioRef.current
      .play()
      .then(() => {
        setState((prev) => ({ ...prev, isPlaying: true }));
      })
      .catch((err) => {
        setState((prev) => ({
          ...prev,
          error: err.message || 'Failed to play audio',
        }));
      });
  }, [state.isReady]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
  }, []);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;

    const clampedTime = Math.max(0, Math.min(time, state.duration || Infinity));
    audioRef.current.currentTime = clampedTime;
    setState((prev) => ({ ...prev, currentTime: clampedTime }));
  }, [state.duration]);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;
    setState((prev) => ({ ...prev, volume: clampedVolume }));
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    const newMuted = !state.isMuted;
    audioRef.current.muted = newMuted;
    setState((prev) => ({ ...prev, isMuted: newMuted }));
  }, [state.isMuted]);

  return {
    ...state,
    play,
    pause,
    stop,
    seek,
    setVolume,
    toggleMute,
    loadAudio,
  };
}
