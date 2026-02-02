'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Layers, 
  Calculator, 
  FileText, 
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  Terminal,
  Code2,
  Eye,
  Search,
  GitBranch,
  FileCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

// Simple token estimation (rough approximation)
const estimateTokens = (text: string): number => {
  // Average of 4 characters per token for English text
  return Math.ceil(text.length / 4);
};

// Chunk text based on different strategies
const chunkText = (text: string, strategy: 'fixed' | 'sentence' | 'paragraph' | 'semantic', chunkSize: number): string[] => {
  if (!text.trim()) return [];

  switch (strategy) {
    case 'fixed':
      const chunks: string[] = [];
      for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
      }
      return chunks;

    case 'sentence':
      // Split by sentence endings
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      const sentenceChunks: string[] = [];
      let currentChunk = '';
      
      for (const sentence of sentences) {
        if ((currentChunk + sentence).length > chunkSize && currentChunk) {
          sentenceChunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk += sentence;
        }
      }
      if (currentChunk) sentenceChunks.push(currentChunk.trim());
      return sentenceChunks;

    case 'paragraph':
      const paragraphs = text.split(/\n\n+/);
      const paraChunks: string[] = [];
      let currentPara = '';
      
      for (const para of paragraphs) {
        if ((currentPara + para).length > chunkSize && currentPara) {
          paraChunks.push(currentPara.trim());
          currentPara = para;
        } else {
          currentPara += para + '\n\n';
        }
      }
      if (currentPara) paraChunks.push(currentPara.trim());
      return paraChunks;

    case 'semantic':
      // Simulate semantic chunking by looking for natural boundaries
      const semanticChunks: string[] = [];
      const lines = text.split('\n');
      let currentSemantic = '';
      
      for (const line of lines) {
        if ((currentSemantic + line).length > chunkSize && currentSemantic) {
          semanticChunks.push(currentSemantic.trim());
          currentSemantic = line;
        } else {
          currentSemantic += line + '\n';
        }
      }
      if (currentSemantic) semanticChunks.push(currentSemantic.trim());
      return semanticChunks;

    default:
      return [text];
  }
};

interface ChunkResult {
  id: number;
  content: string;
  tokens: number;
  strategy: string;
  preview: string;
}

interface UserInputSimulatorProps {
  onClose?: () => void;
}

export default function UserInputSimulator({ onClose }: UserInputSimulatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<'fixed' | 'sentence' | 'paragraph' | 'semantic'>('fixed');
  const [chunkSize, setChunkSize] = useState(1000);
  const [results, setResults] = useState<ChunkResult[] | null>(null);
  const [copiedChunk, setCopiedChunk] = useState<number | null>(null);

  const tokenCount = useMemo(() => estimateTokens(userInput), [userInput]);

  const handleSimulate = useCallback(() => {
    if (!userInput.trim()) return;

    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const chunks = chunkText(userInput, selectedStrategy, chunkSize);
      const chunkResults: ChunkResult[] = chunks.map((content, index) => ({
        id: index + 1,
        content,
        tokens: estimateTokens(content),
        strategy: selectedStrategy,
        preview: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
      }));
      
      setResults(chunkResults);
      setIsProcessing(false);
    }, 800);
  }, [userInput, selectedStrategy, chunkSize]);

  const handleCopyChunk = async (chunk: ChunkResult) => {
    await navigator.clipboard.writeText(chunk.content);
    setCopiedChunk(chunk.id);
    setTimeout(() => setCopiedChunk(null), 2000);
  };

  const getStrategyIcon = (strategy: string) => {
    switch (strategy) {
      case 'fixed': return FileCode;
      case 'sentence': return Eye;
      case 'paragraph': return FileText;
      case 'semantic': return Sparkles;
      default: return Layers;
    }
  };

  const getStrategyDescription = (strategy: string) => {
    switch (strategy) {
      case 'fixed': return 'Fixed-size chunks (like traditional chunking)';
      case 'sentence': return 'Sentence boundaries (natural language)';
      case 'paragraph': return 'Paragraph boundaries (document structure)';
      case 'semantic': return 'Semantic boundaries (content-aware)';
      default: return '';
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#262626] rounded-lg hover:border-[#22c55e] hover:text-[#22c55e] transition-all"
            >
              <Terminal className="w-4 h-4" />
              <span className="font-mono text-sm">Try Your Own Input</span>
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#111111] border-[#262626] text-[#e5e5e5]">
            <p className="font-mono text-xs">Simulate RLM processing on your text</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Main Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#111111] border-[#262626] text-[#e5e5e5] max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                <Layers className="w-5 h-5 text-[#22c55e]" />
              </div>
              <div>
                <DialogTitle className="font-mono text-lg text-[#e5e5e5]">
                  RLM Input Simulator
                </DialogTitle>
                <DialogDescription className="font-mono text-xs text-[#737373]">
                  Paste your own context and see how an RLM would process it
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-mono text-sm text-[#e5e5e5]">Your Context</label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Paste your text here to see how an RLM would chunk and process it..."
                  className="w-full h-48 p-4 bg-[#0a0a0a] border border-[#262626] rounded-lg font-mono text-sm text-[#e5e5e5] placeholder:text-[#525252] focus:border-[#22c55e] focus:outline-none resize-none"
                />
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#737373]">
                    {userInput.length.toLocaleString()} characters
                  </span>
                  <span className="text-[#22c55e]">
                    ~{tokenCount.toLocaleString()} tokens
                  </span>
                </div>
              </div>

              {/* Strategy Selection */}
              <div className="space-y-2">
                <label className="font-mono text-sm text-[#e5e5e5]">Chunking Strategy</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['fixed', 'sentence', 'paragraph', 'semantic'] as const).map((strategy) => {
                    const Icon = getStrategyIcon(strategy);
                    return (
                      <button
                        key={strategy}
                        onClick={() => setSelectedStrategy(strategy)}
                        className={`p-3 border rounded-lg text-left transition-all ${
                          selectedStrategy === strategy
                            ? 'border-[#22c55e] bg-[#22c55e]/10'
                            : 'border-[#262626] bg-[#0a0a0a] hover:border-[#404040]'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${selectedStrategy === strategy ? 'text-[#22c55e]' : 'text-[#737373]'}`} />
                          <span className={`font-mono text-sm capitalize ${selectedStrategy === strategy ? 'text-[#22c55e]' : 'text-[#e5e5e5]'}`}>
                            {strategy}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-[#737373]">
                          {getStrategyDescription(strategy)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chunk Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-sm text-[#e5e5e5]">Chunk Size</label>
                  <span className="font-mono text-xs text-[#22c55e]">{chunkSize.toLocaleString()} chars</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                  className="w-full h-2 bg-[#0a0a0a] rounded-lg appearance-none cursor-pointer accent-[#22c55e]"
                />
                <div className="flex justify-between text-xs font-mono text-[#737373]">
                  <span>100</span>
                  <span>5,000</span>
                </div>
              </div>

              {/* Simulate Button */}
              <Button
                onClick={handleSimulate}
                disabled={!userInput.trim() || isProcessing}
                className="w-full bg-[#22c55e] hover:bg-[#22c55e]/90 text-[#0a0a0a] font-mono disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                    </motion.div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Simulate RLM Processing
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-mono text-sm text-[#e5e5e5]">Results</label>
                {results && (
                  <Badge variant="outline" className="border-[#22c55e] text-[#22c55e] font-mono text-xs">
                    {results.length} chunks created
                  </Badge>
                )}
              </div>

              <ScrollArea className="h-[500px] border border-[#262626] rounded-lg bg-[#0a0a0a]">
                {results ? (
                  <div className="p-4 space-y-3">
                    {results.map((chunk, index) => (
                      <motion.div
                        key={chunk.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="bg-[#111111] border-[#262626] p-4 hover:border-[#404040] transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="border-[#22c55e] text-[#22c55e] font-mono text-xs">
                                Chunk {chunk.id}
                              </Badge>
                              <span className="font-mono text-xs text-[#737373]">
                                {chunk.tokens.toLocaleString()} tokens
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopyChunk(chunk)}
                              className="p-1 hover:bg-[#262626] rounded transition-colors"
                            >
                              {copiedChunk === chunk.id ? (
                                <Check className="w-4 h-4 text-[#22c55e]" />
                              ) : (
                                <Copy className="w-4 h-4 text-[#737373]" />
                              )}
                            </button>
                          </div>
                          <p className="font-mono text-sm text-[#e5e5e5] leading-relaxed">
                            {chunk.preview}
                          </p>
                          {chunk.content.length > 100 && (
                            <p className="mt-2 font-mono text-xs text-[#737373]">
                              + {chunk.content.length - 100} more characters
                            </p>
                          )}
                        </Card>
                      </motion.div>
                    ))}

                    {/* Summary */}
                    <div className="mt-4 p-4 bg-[#22c55e]/10 border border-[#22c55e] rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                        <span className="font-mono text-sm text-[#22c55e]">Processing Complete</span>
                      </div>
                      <div className="space-y-1 font-mono text-xs text-[#737373]">
                        <p>Total chunks: {results.length}</p>
                        <p>Total tokens: {results.reduce((sum, c) => sum + c.tokens, 0).toLocaleString()}</p>
                        <p>Average chunk size: {Math.round(results.reduce((sum, c) => sum + c.tokens, 0) / results.length).toLocaleString()} tokens</p>
                        <p>Strategy: {selectedStrategy}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-[#525252]">
                    <Terminal className="w-12 h-12 mb-4" />
                    <p className="font-mono text-sm">Enter text and click Simulate</p>
                    <p className="font-mono text-xs mt-2">to see RLM chunking results</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Export the utility functions for use in other components
export { estimateTokens, chunkText };
