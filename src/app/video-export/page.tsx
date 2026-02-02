'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Film, 
  Play, 
  ArrowLeft,
  Download,
  Settings,
  Clock,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function VideoExportPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [settings, setSettings] = useState({
    duration: 90,
    fps: 30,
    resolution: '1080p',
    format: 'mp4',
  });

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate video generation
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }
    
    setIsGenerating(false);
    // In real implementation, this would trigger Remotion render
    alert('Video generated! (Demo mode - actual Remotion integration needed)');
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white theme-3b1b">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e27]/90 backdrop-blur-sm border-b border-[#2a3050]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Film className="w-5 h-5 text-[#58C4DC]" />
                <span className="font-serif text-lg font-semibold">
                  RLMs<span className="text-[#58C4DC]">.viz</span>
                </span>
              </Link>
              <div className="h-6 w-px bg-[#2a3050]" />
              <Link 
                href="/visualizer" 
                className="flex items-center gap-1 font-mono text-sm text-[#9FA4B8] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Visualizer
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <Badge className="mb-4 bg-[#58C4DC]/20 text-[#58C4DC] border-[#58C4DC]">
              <Film className="w-3 h-3 mr-1" />
              Video Export
            </Badge>
            <h1 className="text-4xl font-serif mb-4">
              Export Your <span className="text-[#58C4DC]">RLM Visualization</span>
            </h1>
            <p className="text-[#9FA4B8] max-w-2xl mx-auto">
              Generate a cinematic video of the RLM process using Remotion. 
              Perfect for sharing on Twitter, YouTube, or presentations.
            </p>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-[#1a1f3a] border-[#2a3050] overflow-hidden">
              <div className="aspect-video bg-[#0a0e27] relative flex items-center justify-center">
                {/* Placeholder for video preview */}
                <div className="text-center">
                  <Play className="w-16 h-16 text-[#58C4DC] mx-auto mb-4" />
                  <p className="text-[#9FA4B8] font-mono">
                    Preview will appear here
                  </p>
                  <p className="text-xs text-[#6B7280] mt-2">
                    (Connect to /3b1b animation)
                  </p>
                </div>
                
                {/* Overlay info */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-[#0a0e27]/80 text-[#58C4DC]">
                    {settings.resolution}
                  </Badge>
                  <Badge className="bg-[#0a0e27]/80 text-[#FFFF00]">
                    {settings.fps} FPS
                  </Badge>
                </div>
                
                <div className="absolute bottom-4 right-4 text-[#9FA4B8] font-mono text-sm">
                  {formatTime(settings.duration)}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-[#1a1f3a] border-[#2a3050] p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-[#58C4DC]" />
                <h2 className="text-xl font-serif">Export Settings</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Duration */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-[#9FA4B8] mb-3">
                    <Clock className="w-4 h-4" />
                    Duration: {formatTime(settings.duration)}
                  </label>
                  <Slider
                    value={[settings.duration]}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, duration: value[0] }))}
                    min={30}
                    max={180}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[#6B7280] mt-2">
                    <span>0:30</span>
                    <span>3:00</span>
                  </div>
                </div>

                {/* Resolution */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-[#9FA4B8] mb-3">
                    <Monitor className="w-4 h-4" />
                    Resolution
                  </label>
                  <Select
                    value={settings.resolution}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, resolution: value }))}
                  >
                    <SelectTrigger className="bg-[#0a0e27] border-[#2a3050] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1f3a] border-[#2a3050]">
                      <SelectItem value="1080p">1080p (1920×1080)</SelectItem>
                      <SelectItem value="4k">4K (3840×2160)</SelectItem>
                      <SelectItem value="twitter">Twitter/X (1080×1920)</SelectItem>
                      <SelectItem value="square">Square (1080×1080)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* FPS */}
                <div>
                  <label className="text-sm text-[#9FA4B8] mb-3 block">
                    Frame Rate: {settings.fps} FPS
                  </label>
                  <Slider
                    value={[settings.fps]}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, fps: value[0] }))}
                    min={24}
                    max={60}
                    step={6}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[#6B7280] mt-2">
                    <span>24</span>
                    <span>60</span>
                  </div>
                </div>

                {/* Format */}
                <div>
                  <label className="text-sm text-[#9FA4B8] mb-3 block">
                    Output Format
                  </label>
                  <Select
                    value={settings.format}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger className="bg-[#0a0e27] border-[#2a3050] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1f3a] border-[#2a3050]">
                      <SelectItem value="mp4">MP4 (H.264)</SelectItem>
                      <SelectItem value="webm">WebM</SelectItem>
                      <SelectItem value="gif">GIF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Generate Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-[#58C4DC] hover:bg-[#3EB5C8] text-[#0a0e27] font-semibold py-6 text-lg"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="mr-2"
                  >
                    <Settings className="w-5 h-5" />
                  </motion.div>
                  Generating... {progress}%
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Generate Video
                </>
              )}
            </Button>
            
            {isGenerating && (
              <div className="mt-4">
                <div className="h-2 bg-[#1a1f3a] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#58C4DC]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-[#9FA4B8] mt-2">
                  Rendering frames with Remotion...
                </p>
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-[#6B7280]">
              Powered by Remotion • Estimated file size: ~50MB for 90s 1080p
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
