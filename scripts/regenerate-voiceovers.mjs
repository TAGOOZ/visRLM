/**
 * Generate voiceover audio files for the 3B1B RLM visualization
 * Using ElevenLabs API with voice "Adam"
 */

import { ElevenLabsClient } from 'elevenlabs';

// Configure ElevenLabs client
const client = new ElevenLabsClient({
  apiKey: '2ad82bc55b939ac5723b865343cb98cd2b9789873c87836df47317879386d5bd',
});

// Voice ID for "Adam" (professional voice)
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB';
const VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.8,
  style: 0.0,
  use_speaker_boost: true,
};

// Voiceover scripts matching the Python API code example
const VOICE_OVER_SCRIPTS = [
  {
    id: 1,
    title: "Introduction",
    text: "Recursive Language Models explained.",
    duration: 3,
  },
  {
    id: 2,
    title: "Context",
    text: "Here's a Python API server code review. We're examining a 450-line file that handles authentication, database connections, rate limiting, and caching. The code was last modified on January 15th, 2025.",
    duration: 10,
  },
  {
    id: 3,
    title: "Query",
    text: "We ask the question: What was the performance improvement for database queries, and when was the bug fix implemented?",
    duration: 7,
  },
  {
    id: 4,
    title: "Tree",
    text: "The root language model creates a strategy. It decomposes the query into three parts: search the authentication system, search the database pool, and search rate limiting. Each sub-LLM processes its chunk independently.",
    duration: 12,
  },
  {
    id: 5,
    title: "Detail",
    text: "Sub-LLM number two searches the database pool section. It finds the connection pool optimization code with the bug fix from January 10th.",
    duration: 9,
  },
  {
    id: 6,
    title: "Answer",
    text: "Database query performance improved from 450 milliseconds to 120 milliseconds. The bug fix was implemented on January 10th, 2025.",
    duration: 7,
  },
];

async function generateVoiceovers() {
  console.log('🎙️ Starting voiceover generation...\n');
  
  const outputDir = path.join(process.cwd(), 'public', 'audio');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const manifest = {
    scenes: [],
    totalDuration: 0,
    version: '2.0.0',
    project: 'RLMs Visualizer - 3B1B Cinematic',
  };
  
  for (const script of VOICE_OVER_SCRIPTS) {
    const startTime = manifest.totalDuration;
    const audioFile = `/audio/scene-${script.id}.mp3`;
    const outputPath = path.join(outputDir, `scene-${script.id}.mp3`);
    
    console.log(`📝 Scene ${script.id}: "${script.title}"`);
    console.log(`   Text: "${script.text.substring(0, 50)}..."`);
    console.log(`   Duration: ${script.duration}s`);
    
    try {
      // Generate audio
      const audio = await client.textToSpeech.convert(VOICE_ID, {
        model_id: 'eleven_multilingual_v2',
        text: script.text,
        voice_settings: VOICE_SETTINGS,
      });
      
      // Write to file
      fs.writeFileSync(outputPath, Buffer.from(audio));
      const fileSize = fs.statSync(outputPath).size;
      
      console.log(`   ✅ Generated: ${(fileSize / 1024).toFixed(1)} KB\n`);
      
      // Add to manifest
      manifest.scenes.push({
        id: script.id,
        duration: script.duration,
        audioFile,
        text: script.text,
        startTime,
        title: script.title,
        description: script.title,
      });
      
      manifest.totalDuration += script.duration;
      
    } catch (error) {
      console.error(`   ❌ Error generating scene ${script.id}:`, error);
      process.exit(1);
    }
  }
  
  // Write manifest
  const manifestPath = path.join(process.cwd(), 'src', 'data', 'voiceover-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log('✅ Voiceover generation complete!\n');
  console.log(`📊 Total Duration: ${manifest.totalDuration} seconds`);
  console.log(`📁 Audio files: ${outputDir}`);
  console.log(`📄 Manifest: ${manifestPath}`);
}

generateVoiceovers().catch(console.error);
