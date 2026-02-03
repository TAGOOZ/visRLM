'use client';

import React, { useCallback, useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Terminal, GitBranch, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TreeNode } from '@/types';

// Dynamically import React Flow components
const ReactFlow = dynamic(
  () => import('reactflow').then((mod) => mod.ReactFlow),
  { ssr: false }
);
const Background = dynamic(
  () => import('reactflow').then((mod) => mod.Background),
  { ssr: false }
);
const Controls = dynamic(
  () => import('reactflow').then((mod) => mod.Controls),
  { ssr: false }
);
const MiniMap = dynamic(
  () => import('reactflow').then((mod) => mod.MiniMap),
  { ssr: false }
);
const Handle = dynamic(
  () => import('reactflow').then((mod) => mod.Handle),
  { ssr: false }
);

// Import hooks and enums normally (not dynamically)
import { useNodesState, useEdgesState, addEdge, Position } from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node component with terminal aesthetic
interface TreeNodeData {
  node: TreeNode;
  onExpand: (id: string) => void;
  onCollapse: (id: string) => void;
}

const CustomNode = ({ data, id }: any) => {
  const { node, onExpand, onCollapse } = data;
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = node.children !== undefined;

  const getStatusIcon = () => {
    switch (node.status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-[#22c55e]" aria-hidden="true" />;
      case 'active':
        return <Clock className="w-4 h-4 text-[#f59e0b] animate-pulse" aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-[#ef4444]" aria-hidden="true" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-[#404040]" aria-hidden="true" />;
    }
  };

  const getStatusLabel = () => {
    switch (node.status) {
      case 'completed':
        return 'Completed';
      case 'active':
        return 'Active';
      case 'error':
        return 'Error';
      default:
        return 'Pending';
    }
  };

  const getDepthColor = () => {
    const colors = [
      'border-[#22c55e]', // Depth 0 - Green
      'border-[#f59e0b]', // Depth 1 - Amber
      'border-[#06b6d4]', // Depth 2 - Cyan
      'border-[#a855f7]', // Depth 3 - Purple
      'border-[#f97316]', // Depth 4+ - Orange
    ];
    return colors[Math.min(node.depth, colors.length - 1)];
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="article"
            aria-label={`Node ${node.id}: ${node.query}. Status: ${getStatusLabel()}. Depth: ${node.depth}`}
            tabIndex={0}
          >
            <Card
              className={`
                relative min-w-[280px] max-w-[320px] p-4 
                bg-[#111111] border-2 ${getDepthColor()}
                shadow-lg hover:shadow-xl transition-shadow
                ${node.status === 'active' ? 'ring-2 ring-[#22c55e] ring-opacity-50' : ''}
              `}
            >
              {/* Depth indicator */}
              <div className="absolute -top-3 -left-3">
                <Badge 
                  variant="outline" 
                  className={`
                    bg-[#0a0a0a] text-xs font-mono
                    ${node.depth === 0 ? 'border-[#22c55e] text-[#22c55e]' : ''}
                    ${node.depth === 1 ? 'border-[#f59e0b] text-[#f59e0b]' : ''}
                    ${node.depth >= 2 ? 'border-[#06b6d4] text-[#06b6d4]' : ''}
                  `}
                >
                  depth={node.depth}
                </Badge>
              </div>

              {/* Node content */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  {getStatusIcon()}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-[#e5e5e5] leading-relaxed break-words">
                      {node.query}
                    </p>
                  </div>
                </div>

                {node.strategy && (
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-3 h-3 text-[#737373]" aria-hidden="true" />
                    <span className="text-xs font-mono text-[#737373]">
                      strategy: {node.strategy}
                    </span>
                  </div>
                )}

                {node.result && (
                  <div className="pt-2 border-t border-[#262626]">
                    <p className="text-xs font-mono text-[#22c55e]">
                      → {node.result}
                    </p>
                  </div>
                )}

                {/* Expand/collapse button */}
                {hasChildren && (
                  <button
                    onClick={() => isExpanded ? onCollapse(id) : onExpand(id)}
                    className="flex items-center gap-1 text-xs font-mono text-[#737373] hover:text-[#e5e5e5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 focus:ring-offset-[#111111] rounded px-2 py-1"
                    aria-label={isExpanded ? `Collapse ${node.children?.length} children` : `Expand ${node.children?.length} children`}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronDown className="w-4 h-4" aria-hidden="true" />
                        <span>collapse ({node.children?.length} children)</span>
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                        <span>expand ({node.children?.length} children)</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Handles for connections */}
              <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 bg-[#22c55e] border-2 border-[#0a0a0a]"
              />
              <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 bg-[#22c55e] border-2 border-[#0a0a0a]"
              />
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="bg-[#111111] border-[#262626] text-[#e5e5e5] max-w-xs"
        >
          <div className="space-y-2">
            <p className="font-mono text-sm">ID: {node.id}</p>
            <p className="font-mono text-xs text-[#737373]">Status: {node.status}</p>
            {node.strategy && (
              <p className="font-mono text-xs text-[#737373]">Strategy: {node.strategy}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

interface RecursionTreeProps {
  initialData?: TreeNode;
  width?: string;
  height?: string;
}

export default function RecursionTree({ 
  initialData,
  width = '100%',
  height = '600px'
}: RecursionTreeProps) {
  // Default demo data based on paper examples
  const defaultData: TreeNode = {
    id: 'root',
    type: 'root',
    query: 'Summarize key findings from 10M token document',
    depth: 0,
    status: 'active',
    strategy: 'partition-map',
    children: [
      {
        id: 'child-1',
        type: 'recursive',
        query: 'Summarize section 1 (0-1M tokens)',
        depth: 1,
        status: 'completed',
        result: 'Section 1: Introduction covers...',
        children: [
          {
            id: 'grandchild-1',
            type: 'leaf',
            query: 'Extract key points from paragraphs 1-100',
            depth: 2,
            status: 'completed',
            result: '3 key points extracted',
          },
          {
            id: 'grandchild-2',
            type: 'leaf',
            query: 'Extract key points from paragraphs 101-200',
            depth: 2,
            status: 'completed',
            result: '2 key points extracted',
          }
        ]
      },
      {
        id: 'child-2',
        type: 'recursive',
        query: 'Summarize section 2 (1M-2M tokens)',
        depth: 1,
        status: 'active',
        strategy: 'grep',
        children: [
          {
            id: 'grandchild-3',
            type: 'leaf',
            query: 'Search for "methodology" keyword',
            depth: 2,
            status: 'completed',
            result: 'Found 15 matches',
          }
        ]
      },
      {
        id: 'child-3',
        type: 'recursive',
        query: 'Summarize section 3 (2M-3M tokens)',
        depth: 1,
        status: 'pending',
      }
    ]
  };

  const [treeData, setTreeData] = useState<TreeNode>(initialData || defaultData);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Convert tree data to React Flow nodes and edges
  const buildGraph = useCallback((node: TreeNode, parentId?: string, x: number = 0, y: number = 0): { nodes: any[], edges: any[] } => {
    const nodes: any[] = [];
    const edges: any[] = [];
    
    const isExpanded = expandedNodes.has(node.id);
    
    nodes.push({
      id: node.id,
      type: 'custom',
      position: { x, y },
      data: { 
        node,
        onExpand: (id: string) => {
          setExpandedNodes(prev => new Set([...prev, id]));
        },
        onCollapse: (id: string) => {
          setExpandedNodes(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }
      },
    });

    if (parentId) {
      edges.push({
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: 'smoothstep',
        style: { stroke: '#22c55e', strokeWidth: 2 },
        animated: node.status === 'active',
      });
    }

    if (node.children && isExpanded) {
      const childWidth = 350;
      const totalWidth = node.children.length * childWidth;
      const startX = x - totalWidth / 2 + childWidth / 2;
      
      node.children.forEach((child, index) => {
        const childX = startX + index * childWidth;
        const childY = y + 200;
        const childGraph = buildGraph(child, node.id, childX, childY);
        nodes.push(...childGraph.nodes);
        edges.push(...childGraph.edges);
      });
    }

    return { nodes, edges };
  }, [expandedNodes]);

  // Update graph when tree data or expanded nodes change
  useEffect(() => {
    if (!isClient) return;
    const graph = buildGraph(treeData);
    setNodes(graph.nodes);
    setEdges(graph.edges);
  }, [treeData, expandedNodes, buildGraph, setNodes, setEdges, isClient]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  if (!isClient) {
    return (
      <div className="w-full h-full bg-[#0a0a0a] rounded-lg overflow-hidden border border-[#262626] flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#737373] font-mono">
          <div className="w-4 h-4 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <span>Loading visualizer...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#0a0a0a] rounded-lg overflow-hidden border border-[#262626]">
      {/* Header */}
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#22c55e]" aria-hidden="true" />
          <span className="font-mono text-sm text-[#e5e5e5]">recursion_tree.visualizer</span>
          <Badge 
            variant="outline" 
            className="ml-2 border-[#f59e0b] text-[#f59e0b] text-xs font-mono"
          >
            Illustrative Example
          </Badge>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="terminal-dot terminal-dot-red" aria-hidden="true" />
          <div className="terminal-dot terminal-dot-yellow" aria-hidden="true" />
          <div className="terminal-dot terminal-dot-green" aria-hidden="true" />
        </div>
      </div>

      {/* React Flow canvas */}
      <div style={{ width, height }}>
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] text-[#737373] font-mono">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
              <span>Loading visualizer...</span>
            </div>
          </div>
        }>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.1}
            maxZoom={2}
            attributionPosition="bottom-left"
            aria-label="Recursion tree visualization showing hierarchical breakdown of tasks"
          >
            <Background 
              color="#262626" 
              gap={20} 
              size={1}
              style={{ backgroundColor: '#0a0a0a' }}
            />
            <Controls 
              className="bg-[#111111] border-[#262626] text-[#e5e5e5]"
              aria-label="Zoom and pan controls"
            />
            <MiniMap
              className="bg-[#111111] border-[#262626]"
              nodeColor={(node: any) => {
                const depth = (node.data?.node as TreeNode)?.depth || 0;
                const colors = ['#22c55e', '#f59e0b', '#06b6d4', '#a855f7', '#f97316'];
                return colors[Math.min(depth, colors.length - 1)];
              }}
              maskColor="rgba(10, 10, 10, 0.8)"
              aria-label="Minimap showing overview of the recursion tree"
            />
          </ReactFlow>
        </Suspense>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-[#111111] border border-[#262626] rounded-md p-3 space-y-2">
        <p className="text-xs font-mono text-[#737373] mb-2">Depth Colors:</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#22c55e]" aria-hidden="true" />
          <span className="text-xs font-mono text-[#e5e5e5]">depth=0 (root)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]" aria-hidden="true" />
          <span className="text-xs font-mono text-[#e5e5e5]">depth=1</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#06b6d4]" aria-hidden="true" />
          <span className="text-xs font-mono text-[#e5e5e5]">depth=2+</span>
        </div>
      </div>
    </div>
  );
}
