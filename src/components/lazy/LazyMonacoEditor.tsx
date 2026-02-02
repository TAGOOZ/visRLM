'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Loading fallback for Monaco Editor
const MonacoEditorFallback = () => (
  <div className="h-full flex items-center justify-center bg-[#0a0a0a] text-[#737373] font-mono">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
      <span>Loading editor...</span>
    </div>
  </div>
);

// Dynamically import Monaco Editor
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  {
    ssr: false,
    loading: MonacoEditorFallback,
  }
);

interface LazyMonacoEditorProps {
  height?: string;
  language?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  theme?: string;
  beforeMount?: (monaco: any) => void;
  options?: any;
}

export default function LazyMonacoEditor({
  height = '100%',
  language = 'python',
  value = '',
  onChange,
  theme = 'vs-dark',
  beforeMount,
  options = {},
}: LazyMonacoEditorProps) {
  return (
    <Suspense fallback={<MonacoEditorFallback />}>
      <MonacoEditor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        theme={theme}
        beforeMount={beforeMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          padding: { top: 16 },
          folding: true,
          renderLineHighlight: 'line',
          matchBrackets: 'always',
          tabSize: 4,
          insertSpaces: true,
          ...options,
        }}
      />
    </Suspense>
  );
}
