import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: "RLMs Visualizer | Recursive Language Models",
  description: "Interactive visualizer for Recursive Language Models (RLMs) - An inference paradigm enabling LLMs to process arbitrarily long prompts through recursive decomposition and REPL environments.",
  keywords: ["RLMs", "Recursive Language Models", "LLM", "Long Context", "AI", "Machine Learning"],
  authors: [{ name: "RLMs Visualizer Team" }],
  openGraph: {
    title: "RLMs Visualizer",
    description: "Interactive visualizer for Recursive Language Models",
    type: "website",
  },
  // Accessibility metadata
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} antialiased bg-[#0a0a0a] text-[#e5e5e5]`}
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#22c55e] focus:text-[#0a0a0a] focus:font-mono focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22c55e]"
        >
          Skip to main content
        </a>
        
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
