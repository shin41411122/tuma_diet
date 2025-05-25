const fs = require('fs');
const path = require('path');
const speech = require('@google-cloud/speech');

// ⬇ここが重要：環境変数からjson文字列を読み取り、一時ファイルに保存
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const credentialsPath = path.join(__dirname, 'gcp-credentials.json');
    fs.writeFileSync(credentialsPath, process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
}

const client = new speech.SpeechClient();

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
