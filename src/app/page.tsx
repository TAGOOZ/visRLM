'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  GitBranch, 
  ArrowRight, 
  ExternalLink,
  BookOpen,
  Code2,
  Layers,
  ArrowRightLeft,
  Quote,
  Github,
  FileText,
  Play
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import paperContent from '@/data/paper-content.json';

const conceptIcons: Record<string, React.ElementType> = {
  'recursive-decomposition': GitBranch,
  'repl-environment': Terminal,
  'context-chunking': Layers,
  'sub-query-delegation': ArrowRightLeft,
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#262626]" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#22c55e]" aria-hidden="true" />
              <span className="font-mono text-lg font-semibold text-[#e5e5e5]">
                RLMs<span className="text-[#22c55e]">.viz</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link 
                href="/visualizer" 
                className="font-mono text-sm text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded px-2 py-1"
                aria-label="Go to Visualizer"
              >
                Visualizer
              </Link>
              <Link 
                href="/playground" 
                className="font-mono text-sm text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded px-2 py-1"
                aria-label="Go to Code Playground"
              >
                Playground
              </Link>
              <a 
                href={paperContent.resources.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-mono text-sm text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded px-2 py-1"
                aria-label="View GitHub repository (opens in new tab)"
              >
                <Github className="w-4 h-4" aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge 
                variant="outline" 
                className="mb-4 border-[#22c55e] text-[#22c55e] font-mono"
              >
                MIT CSAIL Research
              </Badge>
              <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold leading-tight mb-6">
                Recursive
                <br />
                <span className="text-[#22c55e]">Language</span>
                <br />
                Models
              </h1>
              <p className="text-lg font-mono text-[#a3a3a3] mb-8 max-w-lg leading-relaxed">
                An interactive exploration of RLMs — a paradigm enabling LLMs to process 
                arbitrarily long prompts through recursive decomposition and REPL environments.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/visualizer">
                  <Button 
                    className="bg-[#22c55e] hover:bg-[#16a34a] text-[#0a0a0a] font-mono px-6 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                    aria-label="Explore the interactive visualizer"
                  >
                    <Play className="w-4 h-4 mr-2" aria-hidden="true" />
                    Explore Visualizer
                  </Button>
                </Link>
                <a 
                  href={paperContent.resources.paper_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Read the research paper (opens in new tab)"
                >
                  <Button 
                    variant="outline" 
                    className="border-[#262626] text-[#e5e5e5] hover:bg-[#1a1a1a] font-mono focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                  >
                    <FileText className="w-4 h-4 mr-2" aria-hidden="true" />
                    Read Paper
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Terminal Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              role="complementary"
              aria-label="Code preview"
            >
              <Card className="bg-[#111111] border-[#262626] overflow-hidden">
                <div className="terminal-header">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#22c55e]" aria-hidden="true" />
                    <span className="font-mono text-sm text-[#e5e5e5]">rlm_demo.py</span>
                    <Badge 
                      variant="outline" 
                      className="ml-2 border-[#f59e0b] text-[#f59e0b] text-xs font-mono"
                    >
                      Pseudocode
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="terminal-dot terminal-dot-red" aria-hidden="true" />
                    <div className="terminal-dot terminal-dot-yellow" aria-hidden="true" />
                    <div className="terminal-dot terminal-dot-green" aria-hidden="true" />
                  </div>
                </div>
                <div className="p-6 font-mono text-sm space-y-2">
                  <p className="text-[#737373]"># RLMs enable 100x context scaling</p>
                  <p><span className="text-[#a855f7]">from</span> rlm <span className="text-[#a855f7]">import</span> RLM</p>
                  <p className="text-[#737373]">&nbsp;</p>
                  <p>rlm = RLM(backend=<span className="text-[#22c55e]">&quot;openai&quot;</span>, backend_kwargs={'{'}<span className="text-[#22c55e]">&quot;model_name&quot;</span>: <span className="text-[#22c55e]">&quot;gpt-5-nano&quot;</span>{'}'})</p>
                  <p className="text-[#737373]">&nbsp;</p>
                  <p><span className="text-[#737373]"># Process 10M tokens with the same interface as a single LLM call</span></p>
                  <p>response = rlm.completion(</p>
                  <p className="pl-4">query=<span className="text-[#22c55e]">&quot;Summarize findings&quot;</span>,</p>
                  <p className="pl-4">context=ten_million_token_doc</p>
                  <p>)</p>
                  <p className="text-[#737373]">&nbsp;</p>
                  <p className="text-[#06b6d4]">→ ~114% better than GPT-5 on OOLONG</p>
                  <p className="text-[#06b6d4]">→ Median cheaper per query (outliers may be more expensive)</p>
                  <p className="text-[#737373]">&nbsp;</p>
                  <p className="flex items-center gap-1 text-[#22c55e]">
                    <span>$</span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      aria-hidden="true"
                    >
                      █
                    </motion.span>
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Insights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#262626]" aria-labelledby="insights-heading">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 id="insights-heading" className="text-2xl font-mono font-bold mb-2">Key Insights</h2>
            <p className="font-mono text-[#a3a3a3]">From the paper authors</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list" aria-label="Key insights from paper authors">
            {paperContent.key_insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                role="listitem"
              >
                <Card className="bg-[#111111] border-[#262626] p-6 h-full hover:border-[#22c55e]/50 transition-colors">
                  <Quote className="w-6 h-6 text-[#22c55e] mb-4" aria-hidden="true" />
                  <blockquote className="font-mono text-[#e5e5e5] mb-4 leading-relaxed">
                    &ldquo;{insight.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm text-[#e5e5e5]">{insight.author}</p>
                      <p className="font-mono text-xs text-[#a3a3a3]">{insight.handle}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="border-[#f59e0b] text-[#f59e0b] font-mono text-xs"
                    >
                      {insight.highlight}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Concepts */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#262626]" aria-labelledby="concepts-heading">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 id="concepts-heading" className="text-2xl font-mono font-bold mb-2">Core Concepts</h2>
            <p className="font-mono text-[#a3a3a3]">Four pillars of the RLM paradigm</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list" aria-label="Core RLM concepts">
            {paperContent.core_concepts.map((concept, index) => {
              const Icon = conceptIcons[concept.id] || Terminal;
              
              return (
                <motion.div
                  key={concept.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  role="listitem"
                >
                  <Link href={`/visualizer?concept=${concept.id}`}>
                    <Card className="bg-[#111111] border-[#262626] p-6 h-full hover:border-[#22c55e] transition-all group cursor-pointer focus-within:ring-2 focus-within:ring-[#22c55e] focus-within:ring-offset-2 focus-within:ring-offset-[#0a0a0a]">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-[#0a0a0a] rounded-lg border border-[#262626] group-hover:border-[#22c55e] transition-colors">
                          <Icon className="w-6 h-6 text-[#22c55e]" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-mono text-lg font-semibold mb-2 group-hover:text-[#22c55e] transition-colors">
                            {concept.title}
                          </h3>
                          <p className="font-mono text-sm text-[#a3a3a3] mb-4 leading-relaxed">
                            {concept.simple_explanation}
                          </p>
                          <div className="flex items-center gap-2 text-[#22c55e] font-mono text-sm">
                            <span>Explore</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Performance Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#262626] bg-[#111111]" aria-labelledby="stats-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="stats-heading" className="sr-only">Performance Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center" role="list" aria-label="Performance metrics">
            <div role="listitem">
              <p className="text-4xl font-mono font-bold text-[#22c55e] mb-2">~114%</p>
              <p className="font-mono text-sm text-[#a3a3a3]">Performance gain over GPT-5</p>
              <p className="font-mono text-xs text-[#525252] mt-1">on OOLONG benchmark (132k tokens)</p>
            </div>
            <div role="listitem">
              <p className="text-4xl font-mono font-bold text-[#f59e0b] mb-2">100x</p>
              <p className="font-mono text-sm text-[#a3a3a3]">Context scaling</p>
              <p className="font-mono text-xs text-[#525252] mt-1">Process 10M+ tokens effectively</p>
            </div>
            <div role="listitem">
              <p className="text-4xl font-mono font-bold text-[#06b6d4] mb-2">10M+</p>
              <p className="font-mono text-sm text-[#a3a3a3]">Tokens tested</p>
              <p className="font-mono text-xs text-[#525252] mt-1">No performance degradation</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#262626]" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="cta-heading" className="text-3xl font-mono font-bold mb-4">
            Ready to explore <span className="text-[#22c55e]">RLMs</span>?
          </h2>
          <p className="font-mono text-[#a3a3a3] mb-8 max-w-2xl mx-auto">
            Dive into interactive visualizations of recursion trees, REPL execution flows, 
            and context chunking strategies. Play with code examples in the playground.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/visualizer">
              <Button 
                className="bg-[#22c55e] hover:bg-[#16a34a] text-[#0a0a0a] font-mono px-8 py-6 text-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                aria-label="Launch the interactive visualizer"
              >
                <Play className="w-5 h-5 mr-2" aria-hidden="true" />
                Launch Visualizer
              </Button>
            </Link>
            <Link href="/playground">
              <Button 
                variant="outline" 
                className="border-[#262626] text-[#e5e5e5] hover:bg-[#1a1a1a] font-mono px-8 py-6 text-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                aria-label="Go to code playground"
              >
                <Code2 className="w-5 h-5 mr-2" aria-hidden="true" />
                Code Playground
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[#262626]" role="contentinfo">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#22c55e]" aria-hidden="true" />
              <span className="font-mono text-[#a3a3a3]">
                RLMs Visualizer — Interactive research visualization
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a 
                href={paperContent.resources.paper_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded px-2 py-1"
                aria-label="Read the paper (opens in new tab)"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                Paper
              </a>
              <a 
                href={paperContent.resources.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded px-2 py-1"
                aria-label="View GitHub repository (opens in new tab)"
              >
                <Github className="w-4 h-4" aria-hidden="true" />
                GitHub
              </a>
              <a 
                href={paperContent.resources.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded px-2 py-1"
                aria-label="Read the blog post (opens in new tab)"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                Blog
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#262626] text-center">
            <p className="font-mono text-xs text-[#525252]">
              Paper by Alex L. Zhang, Tim Kraska, Omar Khattab (MIT CSAIL) • 
              arXiv:2512.24601
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
