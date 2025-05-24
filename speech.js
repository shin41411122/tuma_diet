const speech = require('@google-cloud/speech');

// Google認証情報を環境変数（JSON文字列）から読み込む
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

const client = new speech.SpeechClient({
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key
  }
});

module.exports = async (audioBuffer) => {
  const audioBytes = audioBuffer.toString('base64');

  const request = {
    audio: { content: audioBytes },
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'ja-JP',
    },
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');

  return transcription;
};
