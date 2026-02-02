import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  
  // Production optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-tabs',
    ],
  },
  
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
};

export default nextConfig;
