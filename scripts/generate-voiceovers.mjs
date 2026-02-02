#!/usr/bin/env node
/**
 * Script to generate voiceover audio files for 3Blue1Brown-style animation
 * Uses ElevenLabs API with Adam voice
 */

import { ElevenLabsClient } from 'elevenlabs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_KEY = '2ad82bc55b939ac5723b865343cb98cd2b9789873c87836df47317879386d5bd';
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam - Dominant, Firm
const MODEL = 'eleven_multilingual_v2';
const STABILITY = 0.5;
const CLARITY = 0.8;

// Scene scripts
const scenes = [
  {
    id: 1,
    filename: 'scene-1.mp3',
    text: 'Recursive Language Models explained',
  },
  {
    id: 2,
    filename: 'scene-2.mp3',
    text: "Here's a meeting notes file with 1,247 characters. The Root LM loads the entire context.",
  },
  {
    id: 3,
    filename: 'scene-3.mp3',
    text: "We ask: What is Lisa Park's role transition date and what action item is assigned to her?",
  },
  {
    id: 4,
    filename: 'scene-4.mp3',
    text: 'The Root LM analyzes the query and context size, then decides on a strategy: partition the context into chunks and process recursively.',
  },
  {
    id: 5,
    filename: 'scene-5.mp3',
    text: 'Sub-LLM number 2 searches its assigned chunk. It finds the answer in the Team Updates section.',
  },
  {
    id: 6,
    filename: 'scene-6.mp3',
    text: 'The answer is synthesized. Lisa Park transitions to an Advisory role on February 1st, with the action item to complete knowledge transfer sessions.',
  },
];

const client = new ElevenLabsClient({
  apiKey: API_KEY,
});

const outputDir = path.join(__dirname, '..', '..', 'public', 'audio');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateVoiceover(scene) {
  console.log(`Generating Scene ${scene.id}: ${scene.text.substring(0, 50)}...`);

  try {
    const audio = await client.generate({
      voice: VOICE_ID,
      text: scene.text,
      model_id: MODEL,
      voice_settings: {
        stability: STABILITY,
        similarity_boost: CLARITY,
      },
    });

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    // Save to file
    const outputPath = path.join(outputDir, scene.filename);
    fs.writeFileSync(outputPath, audioBuffer);

    // Estimate duration (rough estimate: ~150 chars per second for Adam voice)
    const estimatedDuration = Math.ceil(scene.text.length / 15);

    console.log(`  ✓ Saved: ${outputPath}`);
    console.log(`  ✓ Size: ${(audioBuffer.length / 1024).toFixed(1)} KB`);
    console.log(`  ✓ Estimated duration: ${estimatedDuration}s`);

    return {
      id: scene.id,
      filename: scene.filename,
      text: scene.text,
      path: outputPath,
      size: audioBuffer.length,
      duration: estimatedDuration,
    };
  } catch (error) {
    console.error(`  ✗ Failed to generate Scene ${scene.id}:`, error.message);
    return null;
  }
}

async function generateAllVoiceovers() {
  console.log('🎙️  ElevenLabs Voiceover Generator');
  console.log('=====================================\n');
  console.log(`Voice: ${VOICE_ID}`);
  console.log(`Model: ${MODEL}`);
  console.log(`Stability: ${STABILITY}`);
  console.log(`Clarity: ${CLARITY}`);
  console.log(`Output: ${outputDir}\n`);

  const results = [];

  for (const scene of scenes) {
    const result = await generateVoiceover(scene);
    if (result) {
      results.push(result);
    }
    console.log('');
  }

  // Create manifest
  const manifest = {
    project: '3Blue1Brown-style RLMs Animation',
    generatedAt: new Date().toISOString(),
    voiceSettings: {
      voice: VOICE_ID,
      model: MODEL,
      stability: STABILITY,
      clarity: CLARITY,
    },
    scenes: results,
    totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
  };

  const manifestPath = path.join(outputDir, 'voiceover-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('\n📊 Summary');
  console.log('==========');
  console.log(`Total scenes: ${results.length}/${scenes.length}`);
  console.log(`Total estimated duration: ${manifest.totalDuration}s`);
  console.log(`\nManifest saved: ${manifestPath}`);

  return results;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllVoiceovers().catch(console.error);
}

export { generateAllVoiceovers, scenes };
