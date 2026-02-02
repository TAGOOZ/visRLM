'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  SkipForward,
  Terminal,
  GitBranch,
  Layers,
  Code2,
  Eye,
  Play,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon: React.ElementType;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to RLMs Visualizer',
    description: 'This interactive tool helps you understand Recursive Language Models through visual demonstrations. Let\'s take a quick tour!',
    target: 'header',
    position: 'bottom',
    icon: Terminal,
  },
  {
    id: 'concepts',
    title: 'Core Concepts',
    description: 'Select from four fundamental RLM concepts: Recursive Decomposition, REPL Environment, Context Chunking, and Sub-Query Delegation.',
    target: 'sidebar',
    position: 'right',
    icon: GitBranch,
  },
  {
    id: 'visualization',
    title: 'Interactive Visualizations',
    description: 'Each concept has a live visualization. Watch the REPL simulator, recursion tree, or context chunking in action.',
    target: 'visualization',
    position: 'left',
    icon: Eye,
  },
  {
    id: 'strategies',
    title: 'Processing Strategies',
    description: 'Learn about emergent strategies like Peeking, Grepping, Partition+Map, and Summarization that RLMs use.',
    target: 'strategies',
    position: 'top',
    icon: Layers,
  },
  {
    id: 'code',
    title: 'Code Examples',
    description: 'View actual Python code examples showing how to implement each RLM pattern in your own projects.',
    target: 'code',
    position: 'top',
    icon: Code2,
  },
  {
    id: 'playground',
    title: 'Try the Playground',
    description: 'Visit the Code Playground to experiment with RLM code examples and run simulations.',
    target: 'playground-link',
    position: 'bottom',
    icon: Play,
  },
];

interface GuidedTourProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function GuidedTour({ onComplete, onSkip }: GuidedTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(true);
  const [showSpotlight, setShowSpotlight] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('rlm-tour-completed');
    if (!tourCompleted) {
      setHasSeenTour(false);
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    localStorage.setItem('rlm-tour-completed', 'skipped');
    setIsOpen(false);
    setShowSpotlight(false);
    onSkip?.();
  }, [onSkip]);

  const handleComplete = useCallback(() => {
    localStorage.setItem('rlm-tour-completed', 'true');
    setIsOpen(false);
    setShowSpotlight(false);
    onComplete?.();
  }, [onComplete]);

  const handleRestart = () => {
    setCurrentStep(0);
    setIsOpen(true);
    setHasSeenTour(false);
  };

  const step = tourSteps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <>
      {/* Help Button - Always Visible */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleRestart}
              className="fixed bottom-6 right-6 z-50 p-3 bg-[#111111] border border-[#262626] rounded-full hover:border-[#22c55e] hover:text-[#22c55e] transition-all shadow-lg group"
            >
              <HelpCircle className="w-5 h-5 text-[#737373] group-hover:text-[#22c55e]" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-[#111111] border-[#262626] text-[#e5e5e5]">
            <p className="font-mono text-xs">Restart Tour</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Tour Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="bg-[#111111] border-[#262626] text-[#e5e5e5] max-w-md"
          showCloseButton={false}
        >
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                <Icon className="w-5 h-5 text-[#22c55e]" />
              </div>
              <DialogTitle className="font-mono text-lg text-[#e5e5e5]">
                {step.title}
              </DialogTitle>
            </div>
            <DialogDescription className="font-mono text-sm text-[#737373]">
              {step.description}
            </DialogDescription>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#737373]">
              <span>Step {currentStep + 1} of {tourSteps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-[#0a0a0a] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#22c55e]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSkip}
                className="bg-transparent border-[#262626] text-[#737373] hover:text-[#e5e5e5] hover:border-[#404040] font-mono text-xs"
              >
                <SkipForward className="w-3 h-3 mr-1" />
                Skip
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="bg-[#0a0a0a] border-[#262626] text-[#e5e5e5] hover:bg-[#1a1a1a] disabled:opacity-50 font-mono"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                className="bg-[#22c55e] border-[#22c55e] text-[#0a0a0a] hover:bg-[#22c55e]/90 font-mono"
              >
                {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'bg-[#22c55e] w-4' 
                    : index < currentStep 
                      ? 'bg-[#22c55e]/50' 
                      : 'bg-[#262626]'
                }`}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Spotlight Overlay */}
      <AnimatePresence>
        {isOpen && showSpotlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pointer-events-none"
          >
            <div className="absolute inset-0 bg-black/50" />
            <div 
              className="absolute bg-transparent border-2 border-[#22c55e] rounded-lg shadow-[0_0_30px_rgba(34,197,94,0.3)]"
              style={{
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 30px rgba(34, 197, 94, 0.5)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hook to check if tour has been completed
export function useTourStatus() {
  const [hasCompletedTour, setHasCompletedTour] = useState(true);

  useEffect(() => {
    const status = localStorage.getItem('rlm-tour-completed');
    setHasCompletedTour(!!status);
  }, []);

  return {
    hasCompletedTour,
    resetTour: () => {
      localStorage.removeItem('rlm-tour-completed');
      setHasCompletedTour(false);
    },
  };
}
