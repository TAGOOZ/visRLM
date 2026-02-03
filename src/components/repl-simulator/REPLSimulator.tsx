'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Terminal,
  ChevronRight,
  RotateCcw,
  Clock,
  Database,
  Code2,
  Printer
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { REPLStep, SimulationState } from '@/types';

interface REPLSimulatorProps {
  steps?: REPLStep[];
  width?: string;
  height?: string;
}

const defaultSteps: REPLStep[] = [
  {
    id: '1',
    stage: 'read',
    action: 'User query received',
    context_preview: '10,000,000 tokens',
    isActive: false,
    timestamp: 0,
  },
  {
    id: '2',
    stage: 'eval',
    action: 'Root LM analyzes query',
    code: 'context_size = len(context)\nprint(f"Context: {context_size} tokens")',
    isActive: false,
    timestamp: 1,
  },
  {
    id: '3',
    stage: 'print',
    action: 'REPL executes code',
    output: 'Context: 10000000 tokens',
    isActive: false,
    timestamp: 2,
  },
  {
    id: '4',
    stage: 'loop',
    action: 'LM decides strategy',
    decision: 'Partition + Map: Split into 100 chunks',
    isActive: false,
    timestamp: 3,
  },
  {
    id: '5',
    stage: 'eval',
    action: 'LM writes decomposition code',
    code: 'chunk_size = 100000\nchunks = [context[i:i+chunk_size] for i in range(0, len(context), chunk_size)]',
    isActive: false,
    timestamp: 4,
  },
  {
    id: '6',
    stage: 'print',
    action: 'REPL creates chunks',
    output: 'Created 100 chunks of ~100k tokens each',
    isActive: false,
    timestamp: 5,
  },
  {
    id: '7',
    stage: 'loop',
    action: 'Launch recursive LM calls',
    decision: 'Process chunks 0-9 with GPT-5-mini',
    isActive: false,
    timestamp: 6,
  },
  {
    id: '8',
    stage: 'eval',
    action: 'Recursive LM processes chunk',
    code: 'recursive_lm("Summarize this chunk", chunks[0])',
    isActive: false,
    timestamp: 7,
  },
  {
    id: '9',
    stage: 'print',
    action: 'Recursive LM returns result',
    output: 'Chunk 0 summary: Introduction covers methodology...',
    isActive: false,
    timestamp: 8,
  },
  {
    id: '10',
    stage: 'loop',
    action: 'Aggregation complete',
    decision: 'FINAL: Combine all summaries',
    isActive: false,
    timestamp: 9,
  },
];

const stageIcons = {
  read: Database,
  eval: Code2,
  print: Printer,
  loop: RotateCcw,
};

const stageColors = {
  read: '#22c55e',
  eval: '#f59e0b',
  print: '#06b6d4',
  loop: '#a855f7',
};

const stageLabels = {
  read: 'Read',
  eval: 'Evaluate',
  print: 'Print',
  loop: 'Loop',
};

export default function REPLSimulator({
  steps = defaultSteps,
  width = '100%',
  height = '500px',
}: REPLSimulatorProps) {
  const [simulation, setSimulation] = useState<SimulationState>({
    isPlaying: false,
    currentStep: 0,
    speed: 1,
    totalSteps: steps.length,
  });

  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState('');

  // Auto-play simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (simulation.isPlaying && simulation.currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setSimulation(prev => {
          const nextStep = prev.currentStep + 1;
          if (nextStep >= steps.length) {
            return { ...prev, isPlaying: false, currentStep: nextStep };
          }
          return { ...prev, currentStep: nextStep };
        });
      }, 2000 / simulation.speed);
    } else if (simulation.currentStep >= steps.length - 1) {
      setSimulation(prev => ({ ...prev, isPlaying: false }));
    }

    return () => clearInterval(interval);
  }, [simulation.isPlaying, simulation.currentStep, simulation.speed, steps.length]);

  // Update execution log and announce changes
  useEffect(() => {
    const currentStepData = steps[simulation.currentStep];
    if (currentStepData) {
      const timestamp = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      
      let logEntry = `[${timestamp}] ${currentStepData.stage.toUpperCase()}: ${currentStepData.action}`;
      
      if (currentStepData.code) {
        logEntry += `\n  > ${currentStepData.code}`;
      }
      if (currentStepData.output) {
        logEntry += `\n  < ${currentStepData.output}`;
      }
      if (currentStepData.decision) {
        logEntry += `\n  → ${currentStepData.decision}`;
      }
      
      setExecutionLog(prev => [...prev, logEntry]);
      
      // Announce step change for screen readers
      setAnnouncement(`Step ${simulation.currentStep + 1} of ${steps.length}: ${stageLabels[currentStepData.stage]} stage - ${currentStepData.action}`);
    }
  }, [simulation.currentStep, steps]);

  const handlePlay = () => {
    setSimulation(prev => ({ ...prev, isPlaying: true }));
    setAnnouncement('Simulation started');
  };

  const handlePause = () => {
    setSimulation(prev => ({ ...prev, isPlaying: false }));
    setAnnouncement('Simulation paused');
  };

  const handleReset = () => {
    setSimulation(prev => ({ ...prev, isPlaying: false, currentStep: 0 }));
    setExecutionLog([]);
    setAnnouncement('Simulation reset');
  };

  const handleStepForward = () => {
    setSimulation(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, steps.length - 1),
    }));
  };

  const handleStepBack = () => {
    setSimulation(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  };

  const handleSpeedChange = (value: number[]) => {
    setSimulation(prev => ({ ...prev, speed: value[0] }));
  };

  const currentStep = steps[simulation.currentStep];

  return (
    <div 
      className="flex flex-col bg-[#0a0a0a] rounded-lg overflow-hidden border border-[#262626]"
      style={{ width, height }}
      role="region"
      aria-label="REPL Simulator - Interactive demonstration of Read-Eval-Print-Loop execution"
    >
      {/* Live region for screen reader announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#22c55e]" aria-hidden="true" />
          <span className="font-mono text-sm text-[#e5e5e5]">repl_simulator.exe</span>
          <Badge 
            variant="outline" 
            className="ml-2 border-[#f59e0b] text-[#f59e0b] text-xs font-mono"
          >
            Demo Scenario
          </Badge>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="terminal-dot terminal-dot-red" aria-hidden="true" />
          <div className="terminal-dot terminal-dot-yellow" aria-hidden="true" />
          <div className="terminal-dot terminal-dot-green" aria-hidden="true" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left: Step Visualization */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto min-h-0">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#a3a3a3]">
              <span>Step {simulation.currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((simulation.currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div 
              className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={simulation.currentStep + 1}
              aria-valuemin={1}
              aria-valuemax={steps.length}
              aria-label={`Simulation progress: step ${simulation.currentStep + 1} of ${steps.length}`}
            >
              <motion.div
                className="h-full bg-[#22c55e]"
                initial={{ width: 0 }}
                animate={{ width: `${((simulation.currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Current Step Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              role="article"
              aria-label={`Current step: ${currentStep?.stage}. ${currentStep?.action}`}
            >
              <Card className="bg-[#111111] border-[#262626] p-6 space-y-4">
                {/* Stage Badge */}
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="font-mono text-sm px-3 py-1"
                    style={{ 
                      borderColor: stageColors[currentStep?.stage || 'read'],
                      color: stageColors[currentStep?.stage || 'read']
                    }}
                  >
                    {currentStep?.stage.toUpperCase()}
                  </Badge>
                  {currentStep?.context_preview && (
                    <span className="text-xs font-mono text-[#a3a3a3]">
                      Context: {currentStep.context_preview}
                    </span>
                  )}
                </div>

                {/* Action */}
                <div className="space-y-2">
                  <p className="text-lg font-mono text-[#e5e5e5]">
                    {currentStep?.action}
                  </p>
                </div>

                {/* Code Block */}
                {currentStep?.code && (
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-[#a3a3a3]">Code:</p>
                    <pre className="bg-[#0a0a0a] border border-[#262626] rounded-md p-3 overflow-x-auto">
                      <code className="text-sm font-mono text-[#22c55e]">
                        {currentStep.code}
                      </code>
                    </pre>
                  </div>
                )}

                {/* Output */}
                {currentStep?.output && (
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-[#a3a3a3]">Output:</p>
                    <div className="bg-[#0a0a0a] border border-[#262626] rounded-md p-3">
                      <p className="text-sm font-mono text-[#06b6d4]">
                        {currentStep.output}
                      </p>
                    </div>
                  </div>
                )}

                {/* Decision */}
                {currentStep?.decision && (
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-[#a3a3a3]">Decision:</p>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-[#a855f7]" aria-hidden="true" />
                      <p className="text-sm font-mono text-[#a855f7]">
                        {currentStep.decision}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Stage Pipeline */}
          <div className="flex items-center justify-between" role="list" aria-label="REPL stage pipeline">
            {(['read', 'eval', 'print', 'loop'] as const).map((stage, index) => {
              const Icon = stageIcons[stage];
              const isActive = currentStep?.stage === stage;
              const isPast = steps.findIndex(s => s.id === currentStep?.id) > 
                            steps.findIndex(s => s.stage === stage && s.id <= (currentStep?.id || ''));
              
              return (
                <div key={stage} className="flex items-center gap-2" role="listitem">
                  <div
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-md font-mono text-xs
                      ${isActive ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]' : ''}
                      ${isPast ? 'text-[#22c55e]' : 'text-[#525252]'}
                      ${!isActive && !isPast ? 'text-[#525252]' : ''}
                    `}
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={`${stageLabels[stage]} stage ${isActive ? '- current' : isPast ? '- completed' : '- pending'}`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span className="uppercase">{stage}</span>
                  </div>
                  {index < 3 && (
                    <ChevronRight className="w-4 h-4 text-[#404040]" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Execution Log */}
        <div className="w-80 border-l border-[#262626] bg-[#111111]">
          <div className="p-3 border-b border-[#262626]">
            <p className="text-xs font-mono text-[#a3a3a3]">Execution Log</p>
          </div>
          <ScrollArea className="h-[calc(100%-40px)]">
            <div className="p-3 space-y-2">
              {executionLog.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs font-mono text-[#a3a3a3] whitespace-pre-wrap break-words"
                >
                  {log}
                </motion.div>
              ))}
              <div className="flex items-center gap-1 text-[#22c55e]">
                <span className="text-xs font-mono">$</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="text-xs font-mono"
                  aria-hidden="true"
                >
                  █
                </motion.span>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Controls */}
      <div className="border-t border-[#262626] bg-[#111111] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2" role="group" aria-label="Simulation controls">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="bg-[#0a0a0a] border-[#262626] hover:bg-[#1a1a1a] text-[#e5e5e5]"
              aria-label="Reset simulation to beginning"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleStepBack}
              disabled={simulation.currentStep === 0}
              className="bg-[#0a0a0a] border-[#262626] hover:bg-[#1a1a1a] text-[#e5e5e5] disabled:opacity-50"
              aria-label="Previous step"
            >
              <SkipBack className="w-4 h-4" aria-hidden="true" />
            </Button>
            {simulation.isPlaying ? (
              <Button
                variant="outline"
                size="icon"
                onClick={handlePause}
                className="bg-[#0a0a0a] border-[#22c55e] hover:bg-[#1a1a1a] text-[#22c55e]"
                aria-label="Pause simulation"
              >
                <Pause className="w-4 h-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                onClick={handlePlay}
                className="bg-[#0a0a0a] border-[#22c55e] hover:bg-[#1a1a1a] text-[#22c55e]"
                aria-label="Play simulation"
              >
                <Play className="w-4 h-4" aria-hidden="true" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={handleStepForward}
              disabled={simulation.currentStep >= steps.length - 1}
              className="bg-[#0a0a0a] border-[#262626] hover:bg-[#1a1a1a] text-[#e5e5e5] disabled:opacity-50"
              aria-label="Next step"
            >
              <SkipForward className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="flex items-center gap-4" role="group" aria-label="Playback speed control">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#a3a3a3]" aria-hidden="true" />
              <span className="text-xs font-mono text-[#a3a3a3]">Speed:</span>
              <Slider
                value={[simulation.speed]}
                onValueChange={handleSpeedChange}
                min={0.5}
                max={3}
                step={0.5}
                className="w-24"
                aria-label="Simulation speed"
                aria-valuenow={simulation.speed}
                aria-valuemin={0.5}
                aria-valuemax={3}
              />
              <span className="text-xs font-mono text-[#e5e5e5] w-8">
                {simulation.speed}x
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
