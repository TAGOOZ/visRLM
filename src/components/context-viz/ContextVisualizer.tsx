'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  Eye, 
  Search, 
  GitBranch, 
  FileText,
  Terminal,
  Info,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ContextChunk } from '@/types';

interface ContextVisualizerProps {
  totalTokens?: number;
  chunks?: ContextChunk[];
}

const defaultChunks: ContextChunk[] = [
  { id: '1', range: [0, 1000], size: 1000, strategy: 'peek', accessed: true, color: '#22c55e' },
  { id: '2', range: [1000, 50000], size: 49000, strategy: 'grep', accessed: true, pattern: 'user_id', color: '#f59e0b' },
  { id: '3', range: [50000, 150000], size: 100000, strategy: 'map', accessed: true, subQueries: 10, color: '#06b6d4' },
  { id: '4', range: [150000, 300000], size: 150000, strategy: 'map', accessed: true, subQueries: 15, color: '#06b6d4' },
  { id: '5', range: [300000, 500000], size: 200000, strategy: 'summarize', accessed: true, color: '#a855f7' },
  { id: '6', range: [500000, 1000000], size: 500000, strategy: 'none', accessed: false, color: '#525252' },
  { id: '7', range: [1000000, 2500000], size: 1500000, strategy: 'none', accessed: false, color: '#525252' },
  { id: '8', range: [2500000, 5000000], size: 2500000, strategy: 'none', accessed: false, color: '#525252' },
  { id: '9', range: [5000000, 7500000], size: 2500000, strategy: 'none', accessed: false, color: '#525252' },
  { id: '10', range: [7500000, 10000000], size: 2500000, strategy: 'none', accessed: false, color: '#525252' },
];

const strategyIcons = {
  peek: Eye,
  grep: Search,
  map: GitBranch,
  summarize: FileText,
  none: Layers,
};

const strategyLabels = {
  peek: 'Peeking',
  grep: 'Grepping',
  map: 'Partition + Map',
  summarize: 'Summarization',
  none: 'Not Accessed',
};

const strategyColors = {
  peek: '#22c55e',
  grep: '#f59e0b',
  map: '#06b6d4',
  summarize: '#a855f7',
  none: '#525252',
};

const strategyDescriptions = {
  peek: 'Quickly view specific sections of context',
  grep: 'Search for patterns or keywords in context',
  map: 'Process chunks in parallel with sub-queries',
  summarize: 'Compress large sections into summaries',
  none: 'Not accessed during this operation',
};

export default function ContextVisualizer({
  totalTokens = 10000000,
  chunks = defaultChunks,
}: ContextVisualizerProps) {
  const [hoveredChunk, setHoveredChunk] = useState<string | null>(null);

  const stats = useMemo(() => {
    const accessedTokens = chunks
      .filter(c => c.accessed)
      .reduce((sum, c) => sum + c.size, 0);
    const accessedPercentage = (accessedTokens / totalTokens) * 100;
    
    const strategyCounts = chunks.reduce((acc, chunk) => {
      acc[chunk.strategy] = (acc[chunk.strategy] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      accessedTokens,
      accessedPercentage: accessedPercentage.toFixed(1),
      strategyCounts,
      totalChunks: chunks.length,
    };
  }, [chunks, totalTokens]);

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    } else if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(0)}k`;
    }
    return tokens.toString();
  };

  return (
    <div 
      className="w-full bg-[#0a0a0a] rounded-lg overflow-hidden border border-[#262626]"
      role="region"
      aria-label="Context Visualizer - Shows how RLM accesses different parts of the context"
    >
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#22c55e]" aria-hidden="true" />
          <span className="font-mono text-sm text-[#e5e5e5]">context_visualizer.dat</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="terminal-dot terminal-dot-red" aria-hidden="true" />
          <div className="terminal-dot terminal-dot-yellow" aria-hidden="true" />
          <div className="terminal-dot terminal-dot-green" aria-hidden="true" />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#111111]">
        <div className="flex items-center gap-6" role="list" aria-label="Context statistics">
          <div role="listitem">
            <p className="text-xs font-mono text-[#a3a3a3]">Total Context</p>
            <p className="text-lg font-mono text-[#e5e5e5]">{formatTokens(totalTokens)} tokens</p>
          </div>
          <div className="h-8 w-px bg-[#262626]" aria-hidden="true" />
          <div role="listitem">
            <p className="text-xs font-mono text-[#a3a3a3]">Accessed</p>
            <p className="text-lg font-mono text-[#22c55e]">
              {formatTokens(stats.accessedTokens)} ({stats.accessedPercentage}%)
            </p>
          </div>
          <div className="h-8 w-px bg-[#262626]" aria-hidden="true" />
          <div role="listitem">
            <p className="text-xs font-mono text-[#a3a3a3]">Chunks</p>
            <p className="text-lg font-mono text-[#e5e5e5]">{stats.totalChunks}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="p-2 hover:bg-[#1a1a1a] rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#111111]"
                  aria-label="Show context visualizer information"
                >
                  <Info className="w-4 h-4 text-[#a3a3a3]" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-[#111111] border-[#262626] text-[#e5e5e5] max-w-xs"
              >
                <p className="text-xs font-mono">
                  This visualization shows how the RLM accesses different parts of the context. 
                  Colors indicate the strategy used to process each chunk.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Heatmap */}
      <div className="p-6 space-y-6">
        {/* Main heatmap visualization */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-[#a3a3a3]">0</span>
            <div 
              className="flex-1 h-12 flex rounded-md overflow-hidden border border-[#262626]"
              role="img"
              aria-label={`Context heatmap showing ${chunks.length} chunks. ${stats.accessedPercentage}% of context accessed.`}
            >
              {chunks.map((chunk) => {
                const Icon = strategyIcons[chunk.strategy];
                const percentage = (chunk.size / totalTokens) * 100;
                const isHovered = hoveredChunk === chunk.id;
                
                return (
                  <TooltipProvider key={chunk.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          className="relative h-full cursor-pointer transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-inset"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: strategyColors[chunk.strategy],
                            opacity: isHovered ? 1 : 0.8,
                          }}
                          onMouseEnter={() => setHoveredChunk(chunk.id)}
                          onMouseLeave={() => setHoveredChunk(null)}
                          onFocus={() => setHoveredChunk(chunk.id)}
                          onBlur={() => setHoveredChunk(null)}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          tabIndex={0}
                          role="button"
                          aria-label={`Chunk ${chunk.id}: ${formatTokens(chunk.range[0])} to ${formatTokens(chunk.range[1])} tokens. Strategy: ${strategyLabels[chunk.strategy]}. ${chunk.accessed ? 'Accessed' : 'Not accessed'}`}
                        >
                          {percentage > 5 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-[#0a0a0a]" aria-hidden="true" />
                            </div>
                          )}
                          {chunk.accessed && percentage > 8 && (
                            <div className="absolute top-1 right-1">
                              <div className="w-2 h-2 rounded-full bg-[#0a0a0a]" aria-hidden="true" />
                            </div>
                          )}
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        className="bg-[#111111] border-[#262626] text-[#e5e5e5]"
                      >
                        <div className="space-y-1">
                          <p className="font-mono text-sm">
                            Range: {formatTokens(chunk.range[0])} - {formatTokens(chunk.range[1])}
                          </p>
                          <p className="font-mono text-xs text-[#a3a3a3]">
                            Size: {formatTokens(chunk.size)} tokens ({percentage.toFixed(1)}%)
                          </p>
                          <p className="font-mono text-xs" style={{ color: strategyColors[chunk.strategy] }}>
                            Strategy: {strategyLabels[chunk.strategy]}
                          </p>
                          {chunk.pattern && (
                            <p className="font-mono text-xs text-[#a3a3a3]">
                              Pattern: {chunk.pattern}
                            </p>
                          )}
                          {chunk.subQueries && (
                            <p className="font-mono text-xs text-[#a3a3a3]">
                              Sub-queries: {chunk.subQueries}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
            <span className="text-xs font-mono text-[#a3a3a3]">{formatTokens(totalTokens)}</span>
          </div>
        </div>

        {/* Chunk Details */}
        <div className="grid grid-cols-5 gap-4" role="list" aria-label="Accessed chunk details">
          {chunks.filter(c => c.accessed).map((chunk, index) => {
            const Icon = strategyIcons[chunk.strategy];
            const percentage = (chunk.size / totalTokens) * 100;
            const isHovered = hoveredChunk === chunk.id;
            
            return (
              <motion.div
                key={chunk.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                role="listitem"
              >
                <Card 
                  className={`
                    p-4 bg-[#111111] border-[#262626] hover:border-[${strategyColors[chunk.strategy]}] 
                    transition-colors cursor-pointer
                    ${isHovered ? 'ring-1 ring-[#22c55e]' : ''}
                  `}
                  onMouseEnter={() => setHoveredChunk(chunk.id)}
                  onMouseLeave={() => setHoveredChunk(null)}
                  onFocus={() => setHoveredChunk(chunk.id)}
                  onBlur={() => setHoveredChunk(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${strategyLabels[chunk.strategy]} chunk: ${formatTokens(chunk.range[0])} to ${formatTokens(chunk.range[1])}. ${percentage.toFixed(1)}% of context${chunk.subQueries ? `. ${chunk.subQueries} sub-queries` : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="p-2 rounded-md"
                      style={{ backgroundColor: `${strategyColors[chunk.strategy]}20` }}
                    >
                      <Icon 
                        className="w-4 h-4" 
                        style={{ color: strategyColors[chunk.strategy] }}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-[#a3a3a3] mb-1">
                        {formatTokens(chunk.range[0])} - {formatTokens(chunk.range[1])}
                      </p>
                      <p className="text-sm font-mono text-[#e5e5e5] truncate">
                        {strategyLabels[chunk.strategy]}
                      </p>
                      <p className="text-xs font-mono mt-1" style={{ color: strategyColors[chunk.strategy] }}>
                        {percentage.toFixed(1)}% of context
                      </p>
                      {chunk.subQueries && (
                        <p className="text-xs font-mono text-[#a3a3a3] mt-1">
                          {chunk.subQueries} sub-queries
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-4 border-t border-[#262626]" role="list" aria-label="Strategy legend">
          {Object.entries(strategyLabels).map(([key, label]) => {
            const Icon = strategyIcons[key as keyof typeof strategyIcons];
            const count = stats.strategyCounts[key] || 0;
            
            return (
              <div key={key} className="flex items-center gap-2" role="listitem">
                <div 
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: strategyColors[key as keyof typeof strategyColors] }}
                  aria-hidden="true"
                />
                <Icon 
                  className="w-3 h-3" 
                  style={{ color: strategyColors[key as keyof typeof strategyColors] }}
                  aria-hidden="true"
                />
                <span className="text-xs font-mono text-[#a3a3a3]">
                  {label} ({count})
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
