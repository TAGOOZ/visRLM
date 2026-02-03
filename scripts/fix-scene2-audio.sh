#!/bin/bash
API_KEY="2ad82bc55b939ac5723b865343cb98cd2b9789873c87836df47317879386d5bd"
VOICE_ID="pNInz6obpgDQGcFmaJgB"

curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}" \
  -H "Content-Type: application/json" \
  -H "xi-api-key: ${API_KEY}" \
  -d '{
    "text": "Here'\''s a Python API server code review. We'\''re examining a 180-line file that handles authentication, database connections, rate limiting, and caching. The code was last modified on January 15th, 2025.",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
      "stability": 0.5,
      "similarity_boost": 0.8
    }
  }' \
  -o public/audio/scene-2.mp3

if [ -f public/audio/scene-2.mp3 ] && [ -s public/audio/scene-2.mp3 ]; then
  echo "✅ Audio regenerated successfully"
  ls -lh public/audio/scene-2.mp3
else
  echo "❌ Failed to regenerate audio"
fi
