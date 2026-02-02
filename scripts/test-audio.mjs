import { ElevenLabsClient } from 'elevenlabs';

const client = new ElevenLabsClient({
  apiKey: '2ad82bc55b939ac5723b865343cb98cd2b9789873c87836df47317879386d5bd',
});

const VOICE_ID = 'pNInz6obpgDQGcFmaJgB';

async function test() {
  try {
    const audio = await client.textToSpeech.convert(VOICE_ID, {
      text: 'Hello world',
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
      },
    });
    
    console.log('Success! Audio size:', audio.length);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
