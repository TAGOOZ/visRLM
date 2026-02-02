'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Copy, 
  Check, 
  Share2, 
  Image as ImageIcon,
  Code2,
  Link,
  X,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toPng, toSvg } from 'html-to-image';

interface ExportFeaturesProps {
  code?: string;
  visualizationRef?: React.RefObject<HTMLElement | null>;
  config?: Record<string, string>;
}

export default function ExportFeatures({ code, visualizationRef, config }: ExportFeaturesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleCopyCode = useCallback(async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleExportPNG = useCallback(async () => {
    if (!visualizationRef?.current) return;
    
    setIsExporting(true);
    try {
      const dataUrl = await toPng(visualizationRef.current, {
        backgroundColor: '#0a0a0a',
        pixelRatio: 2,
      });
      
      const link = document.createElement('a');
      link.download = `rlm-visualization-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      setExported('PNG');
      setTimeout(() => setExported(null), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [visualizationRef]);

  const handleExportSVG = useCallback(async () => {
    if (!visualizationRef?.current) return;
    
    setIsExporting(true);
    try {
      const dataUrl = await toSvg(visualizationRef.current, {
        backgroundColor: '#0a0a0a',
      });
      
      const link = document.createElement('a');
      link.download = `rlm-visualization-${Date.now()}.svg`;
      link.href = dataUrl;
      link.click();
      
      setExported('SVG');
      setTimeout(() => setExported(null), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [visualizationRef]);

  const handleShareURL = useCallback(() => {
    const url = new URL(window.location.href);
    
    // Add config params to URL
    if (config) {
      Object.entries(config).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [config]);

  return (
    <>
      {/* Export Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#262626] rounded-lg hover:border-[#22c55e] hover:text-[#22c55e] transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="font-mono text-sm">Export</span>
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#111111] border-[#262626] text-[#e5e5e5]">
            <p className="font-mono text-xs">Export visualization or code</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Export Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#111111] border-[#262626] text-[#e5e5e5] max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                <Download className="w-5 h-5 text-[#22c55e]" />
              </div>
              <div>
                <DialogTitle className="font-mono text-lg text-[#e5e5e5]">
                  Export & Share
                </DialogTitle>
                <DialogDescription className="font-mono text-xs text-[#737373]">
                  Save or share your visualization
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Export as Image */}
            {visualizationRef && (
              <Card className="bg-[#0a0a0a] border-[#262626] p-4 hover:border-[#404040] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="w-4 h-4 text-[#22c55e]" />
                  <span className="font-mono text-sm text-[#e5e5e5]">Export Image</span>
                </div>
                <p className="font-mono text-xs text-[#737373] mb-3">
                  Save the current visualization as an image file
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPNG}
                    disabled={isExporting}
                    className="flex-1 bg-[#111111] border-[#262626] text-[#e5e5e5] hover:bg-[#1a1a1a] font-mono text-xs"
                  >
                    {exported === 'PNG' ? (
                      <CheckCircle2 className="w-3 h-3 mr-1 text-[#22c55e]" />
                    ) : (
                      <ImageIcon className="w-3 h-3 mr-1" />
                    )}
                    PNG
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportSVG}
                    disabled={isExporting}
                    className="flex-1 bg-[#111111] border-[#262626] text-[#e5e5e5] hover:bg-[#1a1a1a] font-mono text-xs"
                  >
                    {exported === 'SVG' ? (
                      <CheckCircle2 className="w-3 h-3 mr-1 text-[#22c55e]" />
                    ) : (
                      <Code2 className="w-3 h-3 mr-1" />
                    )}
                    SVG
                  </Button>
                </div>
              </Card>
            )}

            {/* Copy Code */}
            {code && (
              <Card className="bg-[#0a0a0a] border-[#262626] p-4 hover:border-[#404040] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-4 h-4 text-[#f59e0b]" />
                  <span className="font-mono text-sm text-[#e5e5e5]">Copy Code</span>
                </div>
                <p className="font-mono text-xs text-[#737373] mb-3">
                  Copy the current code to your clipboard
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="w-full bg-[#111111] border-[#262626] text-[#e5e5e5] hover:bg-[#1a1a1a] font-mono text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-[#22c55e]" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </Card>
            )}

            {/* Share URL */}
            <Card className="bg-[#0a0a0a] border-[#262626] p-4 hover:border-[#404040] transition-colors md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Share2 className="w-4 h-4 text-[#06b6d4]" />
                <span className="font-mono text-sm text-[#e5e5e5]">Share Configuration</span>
              </div>
              <p className="font-mono text-xs text-[#737373] mb-3">
                Generate a shareable URL with your current configuration
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareURL}
                  className="flex-1 bg-[#111111] border-[#262626] text-[#e5e5e5] hover:bg-[#1a1a1a] font-mono text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-[#22c55e]" />
                      URL Copied!
                    </>
                  ) : (
                    <>
                      <Link className="w-3 h-3 mr-1" />
                      Copy Shareable URL
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="bg-[#111111] border-[#262626] text-[#e5e5e5] hover:bg-[#1a1a1a] font-mono text-xs"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#262626]">
            <Badge variant="outline" className="border-[#737373] text-[#737373] font-mono text-xs">
              Exports maintain terminal aesthetic
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="bg-[#0a0a0a] border-[#262626] text-[#e5e5e5] hover:bg-[#1a1a1a] font-mono"
            >
              <X className="w-4 h-4 mr-1" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Hook to read URL params for shared configuration
export function useSharedConfig() {
  const [sharedConfig, setSharedConfig] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const params: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      setSharedConfig(params);
    }
  }, []);

  return sharedConfig;
}
