'use client';

import React, { useRef, useState, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  ArrowLeft,
  Code2,
  BookOpen,
  Play,
  Lightbulb,
  Keyboard,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import paperContent from '@/data/paper-content.json';

// Lazy load heavy components
const CodePlayground = dynamic(
  () => import('@/components/code-playground/CodePlayground'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] flex items-center justify-center bg-[#0a0a0a] text-[#737373] font-mono border border-[#262626] rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <span>Loading code playground...</span>
        </div>
      </div>
    ),
  }
);

const ExportFeatures = dynamic(
  () => import('@/components/export/ExportFeatures'),
  { ssr: false }
);

const KeyboardShortcuts = dynamic(
  () => import('@/components/shortcuts/KeyboardShortcuts'),
  { ssr: false }
);

export default function PlaygroundPage() {
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
            <div className="flex items-center gap-6">
              <Link 
                href="/visualizer" 
                className="font-mono text-sm text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded px-2 py-1"
                aria-label="Go to Visualizer"
              >
                Visualizer
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-mono font-bold mb-2">
                  Code <span className="text-[#22c55e]">Playground</span>
                </h1>
                <p className="font-mono text-[#a3a3a3]">
                  Experiment with RLMs code examples. Edit, run, and explore the concepts.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Suspense fallback={null}>
                  <ExportFeatures 
                    code="# Example RLM code\nfrom rlm import RLM\n\nrlm = RLM(backend='openai', backend_kwargs={'model_name': 'gpt-5-nano'})\nresponse = rlm.completion(query, context).response"
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
          </motion.div>

          {/* Code Playground */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Suspense fallback={
              <div className="w-full h-[600px] flex items-center justify-center bg-[#0a0a0a] text-[#737373] font-mono border border-[#262626] rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
                  <span>Loading code playground...</span>
                </div>
              </div>
            }>
              <CodePlayground />
            </Suspense>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
            role="list"
            aria-label="Playground tips"
          >
            <Card className="bg-[#111111] border-[#262626] p-4" role="listitem">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                  <Lightbulb className="w-4 h-4 text-[#f59e0b]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-semibold mb-1">Try Different Examples</h3>
                  <p className="font-mono text-xs text-[#a3a3a3]">
                    Use the dropdown to switch between different RLM patterns and strategies.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-[#111111] border-[#262626] p-4" role="listitem">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                  <Code2 className="w-4 h-4 text-[#22c55e]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-semibold mb-1">Full vs Simplified</h3>
                  <p className="font-mono text-xs text-[#a3a3a3]">
                    Toggle between full implementation and simplified core concepts.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-[#111111] border-[#262626] p-4" role="listitem">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                  <Play className="w-4 h-4 text-[#06b6d4]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-semibold mb-1">Run Simulations</h3>
                  <p className="font-mono text-xs text-[#a3a3a3]">
                    Click Run to see simulated execution output in the terminal panel.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 pt-8 border-t border-[#262626]"
          >
            <h2 className="text-xl font-mono font-bold mb-4">Additional Resources</h2>
            <div className="flex flex-wrap gap-4" role="list" aria-label="Additional resources">
              <a 
                href={paperContent.resources.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#262626] rounded-lg hover:border-[#22c55e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                aria-label="View official GitHub repository (opens in new tab)"
                role="listitem"
              >
                <Terminal className="w-4 h-4 text-[#22c55e]" aria-hidden="true" />
                <span className="font-mono text-sm">Official GitHub Repo</span>
              </a>
              <a 
                href={paperContent.resources.minimal_impl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#262626] rounded-lg hover:border-[#22c55e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                aria-label="View minimal implementation (opens in new tab)"
                role="listitem"
              >
                <Code2 className="w-4 h-4 text-[#f59e0b]" aria-hidden="true" />
                <span className="font-mono text-sm">Minimal Implementation</span>
              </a>
              <a 
                href={paperContent.resources.paper_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#262626] rounded-lg hover:border-[#22c55e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                aria-label="Read the research paper (opens in new tab)"
                role="listitem"
              >
                <BookOpen className="w-4 h-4 text-[#06b6d4]" aria-hidden="true" />
                <span className="font-mono text-sm">Read the Paper</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <Suspense fallback={null}>
        <KeyboardShortcuts />
      </Suspense>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-[#262626] mt-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <p className="font-mono text-xs text-[#525252]">
            Visualizer by <a href="https://x.com/TAG00Z" target="_blank" rel="noopener noreferrer" className="text-[#737373] hover:text-[#22c55e] transition-colors">Mustafa Tag Eldeen</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
