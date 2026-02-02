// Types for RLMs Visualizer data structures

export interface KeyInsight {
  author: string;
  handle: string;
  quote: string;
  highlight: string;
}

export interface DemoExample {
  input?: string;
  decomposition?: Array<{
    depth: number;
    query: string;
    strategy?: string;
    sub_queries?: Array<{
      depth: number;
      query: string;
      result?: string;
    }>;
  }>;
  steps?: Array<{
    stage: string;
    action: string;
    context_size?: string;
    output?: string;
    result?: string;
    decision?: string;
  }>;
  total_tokens?: number;
  chunks?: Array<{
    range: string;
    strategy: string;
    accessed: boolean;
    pattern?: string;
    sub_queries?: number;
  }>;
  root_lm?: string;
  recursive_calls?: Array<{
    query: string;
    model: string;
    depth: number;
  }>;
  aggregation?: string;
}

export interface CoreConcept {
  id: string;
  title: string;
  icon: string;
  simple_explanation: string;
  technical_definition: string;
  analogy: string;
  why_it_matters: string;
  misconception?: string;
  key_features?: string[];
  strategies?: Array<{
    name: string;
    description: string;
    use_case: string;
  }>;
  performance?: Record<string, Record<string, string>>;
  visual_type: string;
  demo_example: DemoExample;
}

export interface Benchmark {
  name: string;
  description: string;
  context_length: string;
  results: Record<string, string>;
  key_finding: string;
}

export interface CodeExample {
  title: string;
  description: string;
  language: string;
  code: string;
  simplified: string;
}

export interface Visual {
  id: string;
  type: string;
  title: string;
  description: string;
  source: string;
  animation_type: string;
}

export interface Resources {
  paper_pdf: string;
  paper_html: string;
  github: string;
  minimal_impl: string;
  blog: string;
  twitter: {
    alex_zhang: string;
    omar_khattab: string;
  };
}

export interface PaperContent {
  title: string;
  authors: string[];
  affiliation: string;
  arxiv_url: string;
  github_url: string;
  blog_url: string;
  publication_date: string;
  abstract: string;
  key_insights: KeyInsight[];
  core_concepts: CoreConcept[];
  benchmarks: Benchmark[];
  code_examples: CodeExample[];
  visuals: Visual[];
  resources: Resources;
}

// Component-specific types
export interface TreeNode {
  id: string;
  type: 'root' | 'recursive' | 'leaf';
  query: string;
  depth: number;
  status: 'pending' | 'active' | 'completed' | 'error';
  result?: string;
  strategy?: string;
  children?: TreeNode[];
  position?: { x: number; y: number };
}

export interface REPLStep {
  id: string;
  stage: 'read' | 'eval' | 'print' | 'loop';
  action: string;
  code?: string;
  output?: string;
  context_preview?: string;
  decision?: string;
  isActive: boolean;
  timestamp?: number;
}

export interface ContextChunk {
  id: string;
  range: [number, number];
  size: number;
  strategy: 'peek' | 'grep' | 'map' | 'summarize' | 'none';
  accessed: boolean;
  pattern?: string;
  subQueries?: number;
  color?: string;
}

export interface SimulationState {
  isPlaying: boolean;
  currentStep: number;
  speed: number;
  totalSteps: number;
}
