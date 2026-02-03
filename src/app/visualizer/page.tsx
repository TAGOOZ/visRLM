'use client';

import React, { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  GitBranch, 
  Code2, 
  Layers,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Eye,
  Search,
  FileText,
  Info,
  Keyboard,
  HelpCircle,
  Film
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import paperContent from '@/data/paper-content.json';

// Lazy load heavy components
const RecursionTree = dynamic(
  () => import('@/components/recursion-tree/RecursionTree'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] flex items-center justify-center bg-[#0a0a0a] text-[#737373] font-mono border border-[#262626] rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <span>Loading recursion tree visualizer...</span>
        </div>
      </div>
    ),
  }
);

const REPLSimulator = dynamic(
  () => import('@/components/repl-simulator/REPLSimulator'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] flex items-center justify-center bg-[#0a0a0a] text-[#737373] font-mono border border-[#262626] rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <span>Loading REPL simulator...</span>
        </div>
      </div>
    ),
  }
);

const ContextVisualizer = dynamic(
  () => import('@/components/context-viz/ContextVisualizer'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center bg-[#0a0a0a] text-[#737373] font-mono border border-[#262626] rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <span>Loading context visualizer...</span>
        </div>
      </div>
    ),
  }
);

// Lazy load additional components
const GuidedTour = dynamic(
  () => import('@/components/tutorial/GuidedTour'),
  { ssr: false }
);

const KeyboardShortcuts = dynamic(
  () => import('@/components/shortcuts/KeyboardShortcuts'),
  { ssr: false }
);

const UserInputSimulator = dynamic(
  () => import('@/components/user-input/UserInputSimulator'),
  { ssr: false }
);

const ExportFeatures = dynamic(
  () => import('@/components/export/ExportFeatures'),
  { ssr: false }
);

const conceptIcons: Record<string, React.ElementType> = {
  'recursive-decomposition': GitBranch,
  'repl-environment': Terminal,
  'context-chunking': Layers,
  'sub-query-delegation': Code2,
};

export default function VisualizerPage() {
  const [selectedConcept, setSelectedConcept] = useState<string>('recursive-decomposition');
  const [showConcepts, setShowConcepts] = useState(true);
  const [replStep, setReplStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const visualizationRef = useRef<HTMLDivElement>(null);

  const currentConcept = paperContent.core_concepts.find(c => c.id === selectedConcept);

  // Keyboard shortcut handlers
  const handleStepChange = useCallback((direction: 'prev' | 'next') => {
    console.log(`Step change requested: ${direction}, current concept: ${selectedConcept}`);
    if (selectedConcept === 'repl-environment') {
      setReplStep(prev => {
        const newStep = direction === 'prev' 
          ? Math.max(0, prev - 1) 
          : Math.min(9, prev + 1);
        console.log(`REPL step changed: ${prev} -> ${newStep}`);
        return newStep;
      });
    } else {
      console.log(`Step change ignored - not in REPL environment mode`);
    }
  }, [selectedConcept]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setReplStep(0);
    setIsPlaying(false);
  }, []);

  const handleConceptChange = useCallback((conceptId: string) => {
    setSelectedConcept(conceptId);
    setReplStep(0);
    setIsPlaying(false);
  }, []);

  // Read URL params on mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const concept = url.searchParams.get('concept');
    if (concept && conceptIcons[concept]) {
      setSelectedConcept(concept);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#262626]" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded px-2 py-1">
                <Terminal className="w-5 h-5 text-[#22c55e]" aria-hidden="true" />
                <span className="font-mono text-lg font-semibold text-[#e5e5e5]">
                  RLMs<span className="text-[#22c55e]">.viz</span>
                </span>
              </Link>
              <div className="h-6 w-px bg-[#262626]" aria-hidden="true" />
              <Link 
                href="/" 
                className="flex items-center gap-1 font-mono text-sm text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded px-2 py-1"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back to Home
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Suspense fallback={null}>
                <UserInputSimulator />
              </Suspense>
              <div className="h-6 w-px bg-[#262626]" aria-hidden="true" />
              <Link 
                href="/playground" 
                className="font-mono text-sm text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded px-2 py-1"
                aria-label="Go to Code Playground"
              >
                Playground
              </Link>
              <div className="h-6 w-px bg-[#262626]" aria-hidden="true" />
              <Link 
                href="/3b1b" 
                className="flex items-center gap-1 font-mono text-sm text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded px-2 py-1"
                aria-label="View 3Blue1Brown-style animation"
              >
                <Film className="w-4 h-4" aria-hidden="true" />
                3B1B Animation
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 flex h-screen">
        {/* Sidebar - Concept Selection */}
        <motion.div 
          className={`border-r border-[#262626] bg-[#111111] overflow-y-auto transition-all duration-300 ${showConcepts ? 'w-80' : 'w-0'}`}
          initial={false}
          animate={{ width: showConcepts ? 320 : 0 }}
        >
          <div className="p-6 space-y-6">
            <div>
              <h2 className="font-mono text-lg font-semibold mb-2">Concepts</h2>
              <p className="font-mono text-xs text-[#a3a3a3]">
                Select a concept to visualize
              </p>
            </div>

            <div className="space-y-2" role="list" aria-label="Available concepts">
              {paperContent.core_concepts.map((concept) => {
                const Icon = conceptIcons[concept.id] || Terminal;
                const isSelected = selectedConcept === concept.id;

                return (
                  <button
                    key={concept.id}
                    onClick={() => setSelectedConcept(concept.id)}
                    className={`
                      w-full text-left p-4 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#111111]
                      ${isSelected 
                        ? 'bg-[#0a0a0a] border-[#22c55e] ring-1 ring-[#22c55e]' 
                        : 'bg-[#111111] border-[#262626] hover:border-[#404040]'
                      }
                    `}
                    role="listitem"
                    aria-label={`${concept.title}${isSelected ? ' - selected' : ''}`}
                    aria-current={isSelected ? 'true' : undefined}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-[#22c55e]' : 'text-[#a3a3a3]'}`} aria-hidden="true" />
                      <div>
                        <h3 className={`font-mono text-sm font-medium ${isSelected ? 'text-[#22c55e]' : 'text-[#e5e5e5]'}`}>
                          {concept.title}
                        </h3>
                        <p className="font-mono text-xs text-[#a3a3a3] mt-1 line-clamp-2">
                          {concept.simple_explanation}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Concept Details */}
            {currentConcept && (
              <div className="pt-6 border-t border-[#262626]">
                <Accordion type="single" collapsible defaultValue="explanation">
                  <AccordionItem value="explanation" className="border-[#262626]">
                    <AccordionTrigger className="font-mono text-sm hover:no-underline">
                      Explanation
                    </AccordionTrigger>
                    <AccordionContent className="font-mono text-xs text-[#a3a3a3] leading-relaxed">
                      {currentConcept.simple_explanation}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="technical" className="border-[#262626]">
                    <AccordionTrigger className="font-mono text-sm hover:no-underline">
                      Technical Details
                    </AccordionTrigger>
                    <AccordionContent className="font-mono text-xs text-[#a3a3a3] leading-relaxed">
                      {currentConcept.technical_definition}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="analogy" className="border-[#262626]">
                    <AccordionTrigger className="font-mono text-sm hover:no-underline">
                      Real-world Analogy
                    </AccordionTrigger>
                    <AccordionContent className="font-mono text-xs text-[#a3a3a3] leading-relaxed">
                      {currentConcept.analogy}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="why" className="border-[#262626]">
                    <AccordionTrigger className="font-mono text-sm hover:no-underline">
                      Why It Matters
                    </AccordionTrigger>
                    <AccordionContent className="font-mono text-xs text-[#a3a3a3] leading-relaxed">
                      {currentConcept.why_it_matters}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>
        </motion.div>

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setShowConcepts(!showConcepts)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] bg-[#111111] border border-[#262626] border-l-0 p-2 rounded-r-lg hover:bg-[#1a1a1a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] shadow-lg"
          aria-label={showConcepts ? 'Hide concepts sidebar' : 'Show concepts sidebar'}
          aria-expanded={showConcepts}
          style={{ display: 'block', visibility: 'visible' }}
        >
          {showConcepts ? (
            <ChevronDown className="w-4 h-4 text-[#a3a3a3] rotate-90" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#a3a3a3]" aria-hidden="true" />
          )}
        </button>

        {/* Main Visualization Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-mono font-bold">
                  {currentConcept?.title || 'Visualizer'}
                </h1>
                <p className="font-mono text-sm text-[#a3a3a3] mt-1">
                  Interactive demonstration of {currentConcept?.title.toLowerCase()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Suspense fallback={null}>
                  <ExportFeatures 
                    visualizationRef={visualizationRef}
                    config={{ concept: selectedConcept }}
                  />
                </Suspense>
                <Badge 
                  variant="outline" 
                  className="border-[#22c55e] text-[#22c55e] font-mono"
                >
                  Interactive
                </Badge>
              </div>
            </div>

            {/* Visualization Tabs */}
            <Tabs defaultValue="visualization" className="w-full">
              <TabsList className="bg-[#111111] border border-[#262626]" role="tablist">
                <TabsTrigger 
                  value="visualization" 
                  className="font-mono text-sm data-[state=active]:bg-[#22c55e] data-[state=active]:text-[#0a0a0a]"
                  role="tab"
                >
                  Visualization
                </TabsTrigger>
                <TabsTrigger 
                  value="strategies" 
                  className="font-mono text-sm data-[state=active]:bg-[#22c55e] data-[state=active]:text-[#0a0a0a]"
                  role="tab"
                >
                  Strategies
                </TabsTrigger>
                <TabsTrigger 
                  value="code" 
                  className="font-mono text-sm data-[state=active]:bg-[#22c55e] data-[state=active]:text-[#0a0a0a]"
                  role="tab"
                >
                  Code Example
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visualization" className="mt-6" ref={visualizationRef as React.RefObject<HTMLDivElement>}>
                <Suspense fallback={
                  <div className="w-full h-[400px] flex items-center justify-center bg-[#0a0a0a] text-[#737373] font-mono border border-[#262626] rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
                      <span>Loading visualization...</span>
                    </div>
                  </div>
                }>
                  {selectedConcept === 'recursive-decomposition' && (
                    <RecursionTree />
                  )}
                  {selectedConcept === 'repl-environment' && (
                    <REPLSimulator />
                  )}
                  {selectedConcept === 'context-chunking' && (
                    <ContextVisualizer />
                  )}
                  {selectedConcept === 'sub-query-delegation' && (
                    <div className="space-y-6">
                      <RecursionTree />
                      <ContextVisualizer />
                    </div>
                  )}
                </Suspense>
              </TabsContent>

              <TabsContent value="strategies" className="mt-6">
                {currentConcept?.strategies ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Available strategies">
                    {currentConcept.strategies.map((strategy, index) => (
                      <Card key={index} className="bg-[#111111] border-[#262626] p-6" role="listitem">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                            {strategy.name === 'Peeking' && <Eye className="w-5 h-5 text-[#22c55e]" aria-hidden="true" />}
                            {strategy.name === 'Grepping' && <Search className="w-5 h-5 text-[#f59e0b]" aria-hidden="true" />}
                            {strategy.name === 'Partition + Map' && <GitBranch className="w-5 h-5 text-[#06b6d4]" aria-hidden="true" />}
                            {strategy.name === 'Summarization' && <FileText className="w-5 h-5 text-[#a855f7]" aria-hidden="true" />}
                          </div>
                          <div>
                            <h3 className="font-mono text-lg font-semibold mb-2">{strategy.name}</h3>
                            <p className="font-mono text-sm text-[#a3a3a3] mb-3">{strategy.description}</p>
                            <Badge variant="outline" className="border-[#22c55e] text-[#22c55e] font-mono text-xs">
                              {strategy.use_case}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-[#111111] border-[#262626] p-12 text-center">
                    <Info className="w-12 h-12 text-[#a3a3a3] mx-auto mb-4" aria-hidden="true" />
                    <p className="font-mono text-[#a3a3a3]">
                      No specific strategies defined for this concept.
                    </p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="code" className="mt-6">
                <Card className="bg-[#111111] border-[#262626] overflow-hidden">
                  <div className="terminal-header">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#22c55e]" aria-hidden="true" />
                      <span className="font-mono text-sm text-[#e5e5e5]">example.py</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <pre className="font-mono text-sm text-[#e5e5e5] overflow-x-auto">
                      <code>
                        {currentConcept?.demo_example ? JSON.stringify(currentConcept.demo_example, null, 2) : 'No code example available'}
                      </code>
                    </pre>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Guided Tour */}
      <Suspense fallback={null}>
        <GuidedTour />
      </Suspense>

      {/* Keyboard Shortcuts */}
      <Suspense fallback={null}>
        <KeyboardShortcuts 
          onStepChange={handleStepChange}
          onPlayPause={handlePlayPause}
          onReset={handleReset}
          onToggleSidebar={() => setShowConcepts(prev => !prev)}
          onConceptChange={handleConceptChange}
        />
      </Suspense>
    </div>
  );
}
