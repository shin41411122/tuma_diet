
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const speechToText = require('./speech');
const chatGPT = require('./gpt');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    const events = req.body.events;
    for (let event of events) {
        if (event.type === 'message' && event.message.type === 'audio') {
            try {
                const audioId = event.message.id;
                const userId = event.source.userId;

                const audioBuffer = await getAudioContent(audioId);
                const text = await speechToText(audioBuffer);
                const recipeResponse = await chatGPT(text);

                await replyMessage(event.replyToken, recipeResponse);
            } catch (err) {
                console.error(err);
            }
        }
    }
    res.sendStatus(200);
});

const getAudioContent = async (messageId) => {
    const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
    const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
            'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        }
    });
    return response.data;
};

const replyMessage = async (replyToken, text) => {
    await axios.post('https://api.line.me/v2/bot/message/reply', {
        replyToken: replyToken,
        messages: [{ type: 'text', text: text }]
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        }
    });
};

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
