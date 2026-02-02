'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Keyboard, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  CornerDownLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KeyboardShortcut {
  key: string;
  display: string;
  description: string;
  icon?: React.ElementType;
  category: 'navigation' | 'playback' | 'general';
}

const shortcuts: KeyboardShortcut[] = [
  {
    key: '?',
    display: '?',
    description: 'Show keyboard shortcuts',
    icon: HelpCircle,
    category: 'general',
  },
  {
    key: 'Escape',
    display: 'Esc',
    description: 'Close modals / Stop playback',
    icon: CornerDownLeft,
    category: 'general',
  },
  {
    key: 'ArrowLeft',
    display: '←',
    description: 'Previous step (REPL)',
    icon: ChevronLeft,
    category: 'navigation',
  },
  {
    key: 'ArrowRight',
    display: '→',
    description: 'Next step (REPL)',
    icon: ChevronRight,
    category: 'navigation',
  },
  {
    key: ' ',
    display: 'Space',
    description: 'Play / Pause simulation',
    icon: Play,
    category: 'playback',
  },
  {
    key: 'r',
    display: 'R',
    description: 'Reset simulation',
    category: 'playback',
  },
  {
    key: 'c',
    display: 'C',
    description: 'Copy code to clipboard',
    category: 'general',
  },
  {
    key: 't',
    display: 'T',
    description: 'Toggle sidebar',
    category: 'general',
  },
  {
    key: '1',
    display: '1',
    description: 'Switch to Recursive Decomposition',
    category: 'navigation',
  },
  {
    key: '2',
    display: '2',
    description: 'Switch to REPL Environment',
    category: 'navigation',
  },
  {
    key: '3',
    display: '3',
    description: 'Switch to Context Chunking',
    category: 'navigation',
  },
  {
    key: '4',
    display: '4',
    description: 'Switch to Sub-Query Delegation',
    category: 'navigation',
  },
];

interface KeyboardShortcutsProps {
  onStepChange?: (direction: 'prev' | 'next') => void;
  onPlayPause?: () => void;
  onReset?: () => void;
  onCopy?: () => void;
  onToggleSidebar?: () => void;
  onConceptChange?: (conceptId: string) => void;
}

export default function KeyboardShortcuts({
  onStepChange,
  onPlayPause,
  onReset,
  onCopy,
  onToggleSidebar,
  onConceptChange,
}: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (event.key) {
      case '?':
        event.preventDefault();
        setIsOpen(true);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        onStepChange?.('prev');
        break;
      case 'ArrowRight':
        event.preventDefault();
        onStepChange?.('next');
        break;
      case ' ':
        event.preventDefault();
        onPlayPause?.();
        break;
      case 'r':
      case 'R':
        event.preventDefault();
        onReset?.();
        break;
      case 'c':
      case 'C':
        event.preventDefault();
        onCopy?.();
        break;
      case 't':
      case 'T':
        event.preventDefault();
        onToggleSidebar?.();
        break;
      case '1':
        event.preventDefault();
        onConceptChange?.('recursive-decomposition');
        break;
      case '2':
        event.preventDefault();
        onConceptChange?.('repl-environment');
        break;
      case '3':
        event.preventDefault();
        onConceptChange?.('context-chunking');
        break;
      case '4':
        event.preventDefault();
        onConceptChange?.('sub-query-delegation');
        break;
    }
  }, [onStepChange, onPlayPause, onReset, onCopy, onToggleSidebar, onConceptChange]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const filteredShortcuts = activeCategory === 'all' 
    ? shortcuts 
    : shortcuts.filter(s => s.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'playback', label: 'Playback' },
    { id: 'general', label: 'General' },
  ];

  return (
    <>
      {/* Keyboard Shortcut Hint */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsOpen(true)}
              className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3 py-2 bg-[#111111] border border-[#262626] rounded-lg hover:border-[#22c55e] transition-all shadow-lg group"
            >
              <Keyboard className="w-4 h-4 text-[#737373] group-hover:text-[#22c55e]" />
              <span className="font-mono text-xs text-[#737373] group-hover:text-[#22c55e]">
                Press <kbd className="px-1.5 py-0.5 bg-[#0a0a0a] rounded text-[#22c55e]">?</kbd> for shortcuts
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-[#111111] border-[#262626] text-[#e5e5e5]">
            <p className="font-mono text-xs">View all keyboard shortcuts</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Shortcuts Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#111111] border-[#262626] text-[#e5e5e5] max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                <Keyboard className="w-5 h-5 text-[#22c55e]" />
              </div>
              <div>
                <DialogTitle className="font-mono text-lg text-[#e5e5e5]">
                  Keyboard Shortcuts
                </DialogTitle>
                <DialogDescription className="font-mono text-xs text-[#737373]">
                  Navigate faster with these keyboard commands
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Category Filter */}
          <div className="flex items-center gap-2 mt-4 pb-4 border-b border-[#262626]">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-1.5 rounded-md font-mono text-xs transition-all ${
                  activeCategory === category.id
                    ? 'bg-[#22c55e] text-[#0a0a0a]'
                    : 'bg-[#0a0a0a] text-[#737373] hover:text-[#e5e5e5] border border-[#262626]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Shortcuts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 overflow-y-auto max-h-[50vh] pr-2">
            {filteredShortcuts.map((shortcut, index) => {
              const Icon = shortcut.icon;
              return (
                <motion.div
                  key={shortcut.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#262626] rounded-lg hover:border-[#404040] transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-[80px]">
                    <kbd className="px-2 py-1 bg-[#111111] border border-[#262626] rounded font-mono text-sm text-[#22c55e]">
                      {shortcut.display}
                    </kbd>
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-sm text-[#e5e5e5]">{shortcut.description}</p>
                  </div>
                  {Icon && (
                    <Icon className="w-4 h-4 text-[#737373]" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#262626]">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-[#22c55e] text-[#22c55e] font-mono text-xs">
                Pro Tip
              </Badge>
              <span className="font-mono text-xs text-[#737373]">
                Shortcuts work everywhere except when typing in input fields
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="bg-[#0a0a0a] border-[#262626] text-[#e5e5e5] hover:bg-[#1a1a1a] font-mono"
            >
              <X className="w-4 h-4 mr-1" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Display component for inline shortcut hints
export function ShortcutHint({ shortcut, className = '' }: { shortcut: string; className?: string }) {
  return (
    <kbd className={`px-1.5 py-0.5 bg-[#0a0a0a] border border-[#262626] rounded font-mono text-xs text-[#22c55e] ${className}`}>
      {shortcut}
    </kbd>
  );
}

// Hook to register keyboard shortcuts
export function useKeyboardShortcuts(handlers: {
  onStepChange?: (direction: 'prev' | 'next') => void;
  onPlayPause?: () => void;
  onReset?: () => void;
  onCopy?: () => void;
  onToggleSidebar?: () => void;
  onConceptChange?: (conceptId: string) => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handlers.onStepChange?.('prev');
          break;
        case 'ArrowRight':
          event.preventDefault();
          handlers.onStepChange?.('next');
          break;
        case ' ':
          event.preventDefault();
          handlers.onPlayPause?.();
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          handlers.onReset?.();
          break;
        case 'c':
        case 'C':
          event.preventDefault();
          handlers.onCopy?.();
          break;
        case 't':
        case 'T':
          event.preventDefault();
          handlers.onToggleSidebar?.();
          break;
        case '1':
          event.preventDefault();
          handlers.onConceptChange?.('recursive-decomposition');
          break;
        case '2':
          event.preventDefault();
          handlers.onConceptChange?.('repl-environment');
          break;
        case '3':
          event.preventDefault();
          handlers.onConceptChange?.('context-chunking');
          break;
        case '4':
          event.preventDefault();
          handlers.onConceptChange?.('sub-query-delegation');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
