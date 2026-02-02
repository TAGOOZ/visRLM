import { ElevenLabsClient } from 'elevenlabs';

const client = new ElevenLabsClient({
  apiKey: '2ad82bc55b939ac5723b865343cb98cd2b9789873c87836df47317879386d5bd',
});

async function listVoices() {
  try {
    const voices = await client.voices.getAll();
    console.log('Available voices:');
    voices.voices.forEach(v => {
      console.log(`- ${v.name} (ID: ${v.voice_id})`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listVoices();
