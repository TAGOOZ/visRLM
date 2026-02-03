'use client';

import React, { useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { 
  Play, 
  Copy, 
  Check,
  Terminal,
  Code2,
  ChevronDown,
  RotateCcw,
  SplitSquareHorizontal
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import paperContent from '@/data/paper-content.json';

// Dynamically import Monaco Editor
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-[#0a0a0a] text-[#737373] font-mono">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <span>Loading editor...</span>
        </div>
      </div>
    ),
  }
);

interface CodeExample {
  id: string;
  title: string;
  description: string;
  code: string;
  simplified: string;
  language: string;
}

const defaultExamples: CodeExample[] = paperContent.code_examples.map((ex, index) => ({
  id: `example-${index}`,
  title: ex.title,
  description: ex.description,
  code: ex.code,
  simplified: ex.simplified,
  language: ex.language,
}));

// Monaco Editor theme configuration for terminal aesthetic
const defineTerminalTheme = (monaco: any) => {
  monaco.editor.defineTheme('terminal', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '737373', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'a855f7' },
      { token: 'string', foreground: '22c55e' },
      { token: 'number', foreground: '06b6d4' },
      { token: 'function', foreground: 'f59e0b' },
      { token: 'variable', foreground: 'e5e5e5' },
      { token: 'type', foreground: 'f97316' },
    ],
    colors: {
      'editor.background': '#0a0a0a',
      'editor.foreground': '#e5e5e5',
      'editor.lineHighlightBackground': '#111111',
      'editorLineNumber.foreground': '#525252',
      'editorLineNumber.activeForeground': '#22c55e',
      'editor.selectionBackground': '#22c55e30',
      'editor.inactiveSelectionBackground': '#22c55e20',
      'editorCursor.foreground': '#22c55e',
      'editorWhitespace.foreground': '#262626',
    },
  });
};

export default function CodePlayground() {
  const [selectedExample, setSelectedExample] = useState<CodeExample>(defaultExamples[0]);
  const [code, setCode] = useState(defaultExamples[0].code);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('full');

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value) setCode(value);
  }, []);

  const handleExampleChange = (exampleId: string) => {
    const example = defaultExamples.find(ex => ex.id === exampleId);
    if (example) {
      setSelectedExample(example);
      setCode(example.code);
      setOutput('');
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    
    // Simulate execution with typing effect
    const lines = [
      '$ python rlm_simulation.py',
      '[INFO] Initializing RLM with backend=openai, model=gpt-5-nano...',
      '[INFO] Loading context: 10,000,000 tokens',
      '[INFO] REPL environment ready',
      '',
      '[EXEC] Root LM analyzing query...',
      '[EXEC] Strategy selected: partition-map',
      '[EXEC] Splitting context into 100 chunks...',
      '[EXEC] Launching recursive LM calls...',
      '  → Processing chunk 1/100',
      '  → Processing chunk 2/100',
      '  ...',
      '  → Processing chunk 100/100',
      '',
      '[RESULT] Aggregation complete',
      '[RESULT] Final answer: "The document discusses recursive language models..."',
      '',
      '[STATS] Total tokens processed: 10,000,000',
      '[STATS] Recursive calls: 100',
      '[STATS] Execution time: Variable based on context size',
      '[STATS] Cost: Lower than direct LLM call',
    ];

    for (const line of lines) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setOutput(prev => prev + line + '\n');
    }

    setIsRunning(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(selectedExample.code);
    setOutput('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-[#0a0a0a] rounded-lg overflow-hidden border border-[#262626]">
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#22c55e]" aria-hidden="true" />
          <span className="font-mono text-sm text-[#e5e5e5]">code_playground.py</span>
          <Badge 
            variant="outline" 
            className="ml-2 border-[#f59e0b] text-[#f59e0b] text-xs font-mono"
          >
            Simulation
          </Badge>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="terminal-dot terminal-dot-red" aria-hidden="true" />
          <div className="terminal-dot terminal-dot-yellow" aria-hidden="true" />
          <div className="terminal-dot terminal-dot-green" aria-hidden="true" />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626] bg-[#111111]">
        <div className="flex items-center gap-4">
          <Select value={selectedExample.id} onValueChange={handleExampleChange}>
            <SelectTrigger 
              className="w-[280px] bg-[#0a0a0a] border-[#262626] text-[#e5e5e5] font-mono"
              aria-label="Select code example"
            >
              <SelectValue placeholder="Select example" />
            </SelectTrigger>
            <SelectContent className="bg-[#111111] border-[#262626]">
              {defaultExamples.map((example) => (
                <SelectItem 
                  key={example.id} 
                  value={example.id}
                  className="font-mono text-[#e5e5e5] focus:bg-[#1a1a1a] focus:text-[#e5e5e5]"
                >
                  {example.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="bg-[#0a0a0a] border border-[#262626]" role="tablist">
              <TabsTrigger 
                value="full" 
                className="font-mono text-xs data-[state=active]:bg-[#22c55e] data-[state=active]:text-[#0a0a0a]"
                role="tab"
                aria-selected={activeTab === 'full'}
              >
                Full
              </TabsTrigger>
              <TabsTrigger 
                value="simplified" 
                className="font-mono text-xs data-[state=active]:bg-[#22c55e] data-[state=active]:text-[#0a0a0a]"
                role="tab"
                aria-selected={activeTab === 'simplified'}
              >
                Simplified
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="bg-[#0a0a0a] border-[#262626] hover:bg-[#1a1a1a] text-[#e5e5e5] font-mono"
            aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
          >
            {copied ? <Check className="w-4 h-4 text-[#22c55e]" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
            <span className="ml-2">{copied ? 'Copied' : 'Copy'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="bg-[#0a0a0a] border-[#262626] hover:bg-[#1a1a1a] text-[#e5e5e5] font-mono"
            aria-label="Reset code to default example"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span className="ml-2">Reset</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
            className="bg-[#0a0a0a] border-[#22c55e] hover:bg-[#1a1a1a] text-[#22c55e] font-mono disabled:opacity-50"
            aria-label={isRunning ? 'Running code simulation' : 'Run code simulation'}
            aria-busy={isRunning}
          >
            <Play className="w-4 h-4" aria-hidden="true" />
            <span className="ml-2">{isRunning ? 'Running...' : 'Run'}</span>
          </Button>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-2 border-b border-[#262626] bg-[#0a0a0a]">
        <p className="text-sm font-mono text-[#a3a3a3]">{selectedExample.description}</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className="flex-1 relative">
          <Suspense fallback={
            <div className="h-full flex items-center justify-center bg-[#0a0a0a] text-[#737373] font-mono">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
                <span>Loading editor...</span>
              </div>
            </div>
          }>
            {activeTab === 'full' ? (
              <MonacoEditor
                height="100%"
                language="python"
                value={code}
                onChange={handleEditorChange}
                theme="terminal"
                beforeMount={defineTerminalTheme}
              />
            ) : (
              <div className="h-full p-6 bg-[#0a0a0a]">
                <Card className="bg-[#111111] border-[#262626] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="border-[#f59e0b] text-[#f59e0b] font-mono">
                      Simplified
                    </Badge>
                  </div>
                  <pre className="font-mono text-lg text-[#e5e5e5] leading-relaxed">
                    <code>{selectedExample.simplified}</code>
                  </pre>
                  <p className="mt-4 text-sm font-mono text-[#a3a3a3]">
                    This is the core concept in its simplest form. Switch to &quot;Full&quot; tab to see the complete implementation.
                  </p>
                </Card>
              </div>
            )}
          </Suspense>
        </div>

        {/* Output Panel */}
        <div className="w-96 border-l border-[#262626] bg-[#111111] flex flex-col">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#262626]">
            <Terminal className="w-4 h-4 text-[#737373]" aria-hidden="true" />
            <span className="font-mono text-sm text-[#737373]">Output</span>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4">
              {output ? (
                <pre 
                  className="font-mono text-sm text-[#e5e5e5] whitespace-pre-wrap"
                  role="log"
                  aria-live="polite"
                  aria-label="Code execution output"
                >
                  <code>{output}</code>
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#525252]">
                  <Terminal className="w-8 h-8 mb-2" aria-hidden="true" />
                  <p className="font-mono text-sm">Click &quot;Run&quot; to execute</p>
                </div>
              )}
              {isRunning && (
                <div className="flex items-center gap-1 text-[#22c55e] mt-2" aria-live="polite">
                  <span className="text-sm font-mono">$</span>
                  <span className="text-sm font-mono animate-pulse">█</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
