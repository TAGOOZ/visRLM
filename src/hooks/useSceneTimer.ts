'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export interface SceneConfig {
  id: number;
  duration: number;
  startTime: number;
}

export interface SceneTimerState {
  currentScene: number;
  elapsedTime: number;
  totalElapsedTime: number;
  isRunning: boolean;
  progress: number; // 0-100
  sceneProgress: number; // 0-100 within current scene
}

export interface UseSceneTimerReturn extends SceneTimerState {
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  jumpToScene: (sceneId: number) => void;
  seekToTime: (time: number) => void;
  getSceneByTime: (time: number) => number;
}

export function useSceneTimer(
  scenes: SceneConfig[],
  totalDuration: number
): UseSceneTimerReturn {
  const [state, setState] = useState<SceneTimerState>({
    currentScene: 1,
    elapsedTime: 0,
    totalElapsedTime: 0,
    isRunning: false,
    progress: 0,
    sceneProgress: 0,
  });

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);

  // Store scenes and duration in refs to avoid recreating callbacks
  const scenesRef = useRef(scenes);
  const totalDurationRef = useRef(totalDuration);

  // Update refs when props change
  useEffect(() => {
    scenesRef.current = scenes;
    totalDurationRef.current = totalDuration;
  }, [scenes, totalDuration]);

  // Calculate which scene we're in based on total elapsed time
  const getSceneByTime = useCallback((time: number): number => {
    let accumulatedTime = 0;
    for (const scene of scenesRef.current) {
      accumulatedTime += scene.duration;
      if (time < accumulatedTime) {
        return scene.id;
      }
    }
    return scenesRef.current[scenesRef.current.length - 1]?.id || 1;
  }, []);

  // Calculate scene-local progress
  const calculateSceneProgress = useCallback((sceneId: number, totalTime: number): number => {
    const scene = scenesRef.current.find((s) => s.id === sceneId);
    if (!scene) return 0;

    const sceneStartTime = scene.startTime;
    const sceneElapsed = totalTime - sceneStartTime;
    return Math.min(100, Math.max(0, (sceneElapsed / scene.duration) * 100));
  }, []);

  // Calculate overall progress
  const calculateOverallProgress = useCallback((totalTime: number): number => {
    return Math.min(100, Math.max(0, (totalTime / totalDurationRef.current) * 100));
  }, []);

  // Animation loop
  const tick = useCallback((timestamp: number) => {
    if (!isRunningRef.current) return;

    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }

    const deltaTime = (timestamp - lastTimeRef.current) / 1000; // Convert to seconds
    lastTimeRef.current = timestamp;

    accumulatedTimeRef.current += deltaTime;

    // Check if we've reached the end
    if (accumulatedTimeRef.current >= totalDurationRef.current) {
      accumulatedTimeRef.current = totalDurationRef.current;
      isRunningRef.current = false;
      setState((prev) => ({
        ...prev,
        isRunning: false,
        totalElapsedTime: totalDurationRef.current,
        progress: 100,
        currentScene: scenesRef.current[scenesRef.current.length - 1]?.id || 1,
        sceneProgress: 100,
        elapsedTime: scenesRef.current[scenesRef.current.length - 1]?.duration || 0,
      }));
      return;
    }

    const currentSceneId = getSceneByTime(accumulatedTimeRef.current);
    const currentScene = scenesRef.current.find((s) => s.id === currentSceneId);
    
    if (currentScene) {
      const sceneElapsed = accumulatedTimeRef.current - currentScene.startTime;
      
      setState({
        currentScene: currentSceneId,
        elapsedTime: sceneElapsed,
        totalElapsedTime: accumulatedTimeRef.current,
        isRunning: true,
        progress: calculateOverallProgress(accumulatedTimeRef.current),
        sceneProgress: calculateSceneProgress(currentSceneId, accumulatedTimeRef.current),
      });
    }

    animationFrameRef.current = requestAnimationFrame(tick);
  }, [getSceneByTime, calculateOverallProgress, calculateSceneProgress]);

  const start = useCallback(() => {
    if (isRunningRef.current) return;
    
    lastTimeRef.current = 0;
    isRunningRef.current = true;
    setState((prev) => ({ ...prev, isRunning: true }));
    animationFrameRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const pause = useCallback(() => {
    if (!isRunningRef.current) return;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    lastTimeRef.current = 0;
    isRunningRef.current = false;
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const resume = useCallback(() => {
    if (isRunningRef.current) return;
    
    lastTimeRef.current = 0;
    isRunningRef.current = true;
    setState((prev) => ({ ...prev, isRunning: true }));
    animationFrameRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    lastTimeRef.current = 0;
    accumulatedTimeRef.current = 0;
    isRunningRef.current = false;
    setState({
      currentScene: 1,
      elapsedTime: 0,
      totalElapsedTime: 0,
      isRunning: false,
      progress: 0,
      sceneProgress: 0,
    });
  }, []);

  const reset = useCallback(() => {
    stop();
  }, [stop]);

  const jumpToScene = useCallback((sceneId: number) => {
    const targetScene = scenesRef.current.find((s) => s.id === sceneId);
    if (!targetScene) return;

    accumulatedTimeRef.current = targetScene.startTime;
    lastTimeRef.current = 0;

    setState((prev) => ({
      currentScene: sceneId,
      elapsedTime: 0,
      totalElapsedTime: targetScene.startTime,
      isRunning: prev.isRunning,
      progress: calculateOverallProgress(targetScene.startTime),
      sceneProgress: 0,
    }));

    // Restart animation if was running
    if (isRunningRef.current && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(tick);
    }
  }, [calculateOverallProgress, tick]);

  const seekToTime = useCallback((time: number) => {
    const clampedTime = Math.max(0, Math.min(time, totalDurationRef.current));
    accumulatedTimeRef.current = clampedTime;
    lastTimeRef.current = 0;

    const currentSceneId = getSceneByTime(clampedTime);
    const currentScene = scenesRef.current.find((s) => s.id === currentSceneId);
    const sceneElapsed = currentScene ? clampedTime - currentScene.startTime : 0;

    setState((prev) => ({
      currentScene: currentSceneId,
      elapsedTime: sceneElapsed,
      totalElapsedTime: clampedTime,
      isRunning: prev.isRunning,
      progress: calculateOverallProgress(clampedTime),
      sceneProgress: calculateSceneProgress(currentSceneId, clampedTime),
    }));

    // Restart animation if was running
    if (isRunningRef.current && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(tick);
    }
  }, [getSceneByTime, calculateOverallProgress, calculateSceneProgress, tick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    ...state,
    start,
    pause,
    resume,
    stop,
    reset,
    jumpToScene,
    seekToTime,
    getSceneByTime,
  };
}
