#!/bin/bash

# Generate voiceover audio files for the 3B1B RLM visualization
# Using ElevenLabs API with voice "Adam" (pNInz6obpgDQGcFmaJgB)

API_KEY="2ad82bc55b939ac5723b865343cb98cd2b9789873c87836df47317879386d5bd"
VOICE_ID="pNInz6obpgDQGcFmaJgB"
API_URL="https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}"

# Output directory
OUTPUT_DIR="public/audio"
mkdir -p "$OUTPUT_DIR"

# Voiceover scripts matching the Python API code example
declare -a SCRIPTS=(
  "1|Introduction|Recursive Language Models explained.|3"
  "2|Context|Here's a Python API server code review. We're examining a 450-line file that handles authentication, database connections, rate limiting, and caching. The code was last modified on January 15th, 2025.|10"
  "3|Query|We ask the question: What was the performance improvement for database queries, and when was the bug fix implemented?|7"
  "4|Tree|The root language model creates a strategy. It decomposes the query into three parts: search the authentication system, search the database pool, and search rate limiting. Each sub-LLM processes its chunk independently.|12"
  "5|Detail|Sub-LLM number two searches the database pool section. It finds the connection pool optimization code with the bug fix from January 10th.|9"
  "6|Answer|Database query performance improved from 450 milliseconds to 120 milliseconds. The bug fix was implemented on January 10th, 2025.|7"
)

echo "🎙️ Generating voiceover audio files..."
echo ""

TOTAL_DURATION=0
MANIFEST_SCENES=""

for script in "${SCRIPTS[@]}"; do
  IFS='|' read -r id title text duration <<< "$script"
  
  echo "📝 Scene $id: $title"
  echo "   Duration: ${duration}s"
  echo "   Text: ${text:0:60}..."
  
  # Generate audio
  OUTPUT_FILE="${OUTPUT_DIR}/scene-${id}.mp3"
  
  response=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "xi-api-key: $API_KEY" \
    -d "{
      \"text\": \"$text\",
      \"model_id\": \"eleven_multilingual_v2\",
      \"voice_settings\": {
        \"stability\": 0.5,
        \"similarity_boost\": 0.8,
        \"style\": 0.0,
        \"use_speaker_boost\": true
      }
    }" -o "$OUTPUT_FILE" -w "%{http_code}")
  
  if [ -f "$OUTPUT_FILE" ] && [ -s "$OUTPUT_FILE" ]; then
    file_size=$(stat -f%z "$OUTPUT_FILE" 2>/dev/null || stat -c%s "$OUTPUT_FILE" 2>/dev/null)
    echo "   ✅ Generated: $(echo "scale=1; $file_size/1024" | bc) KB"
    
    # Add to manifest
    MANIFEST_SCENES="${MANIFEST_SCENES}
    {
      \"id\": $id,
      \"duration\": $duration,
      \"audioFile\": \"/audio/scene-${id}.mp3\",
      \"text\": \"$text\",
      \"startTime\": $TOTAL_DURATION,
      \"title\": \"$title\",
      \"description\": \"$title\"
    },"
    
    TOTAL_DURATION=$((TOTAL_DURATION + duration))
  else
    echo "   ❌ Failed to generate audio (HTTP: $response)"
  fi
  
  echo ""
done

# Create manifest
MANIFEST="{${MANIFEST_SCENES%?}
  \"totalDuration\": $TOTAL_DURATION,
  \"version\": \"2.0.0\",
  \"project\": \"RLMs Visualizer - 3B1B Cinematic\"
}"

echo "📄 Writing manifest to src/data/voiceover-manifest.json..."
echo "$MANIFEST" | python3 -m json.tool > src/data/voiceover-manifest.json

echo ""
echo "✅ Voiceover generation complete!"
echo "📊 Total Duration: $TOTAL_DURATION seconds"
echo "📁 Audio files: $OUTPUT_DIR/"
echo "📄 Manifest: src/data/voiceover-manifest.json"
