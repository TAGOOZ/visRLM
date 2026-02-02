'use client';

import { motion } from 'framer-motion';

interface TreeSceneProps {
  isActive?: boolean;
}

interface TreeNode {
  id: string;
  label: string;
  subLabel?: string;
  x: number;
  y: number;
  delay: number;
}

const nodes: TreeNode[] = [
  { id: 'root', label: 'Root LM', subLabel: 'Strategy: Code Search', x: 450, y: 80, delay: 0 },
  { id: 'sub1', label: 'Sub-LLM 1', subLabel: 'Auth System', x: 200, y: 280, delay: 0.3 },
  { id: 'sub2', label: 'Sub-LLM 2', subLabel: 'Database Pool', x: 450, y: 280, delay: 0.5 },
  { id: 'sub3', label: 'Sub-LLM 3', subLabel: 'Rate Limiting', x: 700, y: 280, delay: 0.7 },
];

export function TreeScene({ isActive = true }: TreeSceneProps) {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-[900px] h-[600px] flex items-center justify-center bg-[#0a0e27] relative overflow-hidden"
    >
      <div className="relative w-full h-full">
        {/* SVG Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {/* Root to Sub-LLM 1 */}
          <motion.path
            d="M 450 120 Q 200 120 200 240"
            fill="none"
            stroke="#58C4DC"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          
          {/* Root to Sub-LLM 2 */}
          <motion.path
            d="M 450 120 Q 450 180 450 240"
            fill="none"
            stroke="#58C4DC"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          
          {/* Root to Sub-LLM 3 */}
          <motion.path
            d="M 450 120 Q 700 120 700 240"
            fill="none"
            stroke="#58C4DC"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          />

          {/* Animated pulse on active connection (Sub-LLM 2) */}
          <motion.circle
            r="5"
            fill="#FFFF00"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          >
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path="M 450 120 Q 450 180 450 240"
            />
          </motion.circle>
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: 'spring', 
              damping: 15, 
              delay: node.delay 
            }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: node.x,
              top: node.y,
              zIndex: 10
            }}
          >
            <div 
              className={`
                w-[200px] p-5 rounded-xl border-2 shadow-lg text-center
                ${node.id === 'root' ? 'bg-[#58C4DC]/10 border-[#58C4DC]' : 'bg-[#1a1f3a] border-[#2a3050]'}
                ${node.id === 'sub2' ? 'border-[#FFFF00] shadow-[#FFFF00]/20' : ''}
              `}
            >
              <div className={`text-lg font-bold mb-1 ${node.id === 'root' ? 'text-[#58C4DC]' : 'text-[#E5E5E5]'}`}>
                {node.label}
              </div>
              
              {node.subLabel && (
                <div className={`text-xs ${node.id === 'sub2' ? 'text-[#FFFF00]' : 'text-[#9FA4B8]'}`}>
                  {node.subLabel}
                </div>
              )}

              {/* Active indicator for Sub-LLM 2 */}
              {node.id === 'sub2' && (
                <motion.div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="w-3 h-3 bg-[#FFFF00] rounded-full" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6 text-xs"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#58C4DC]" />
            <span className="text-[#9FA4B8]">Root LM</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFFF00]" />
            <span className="text-[#9FA4B8]">Active Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#1a1f3a] border border-[#2a3050]" />
            <span className="text-[#9FA4B8]">Sub-LLM</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
