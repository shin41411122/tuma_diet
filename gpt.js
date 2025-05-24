require('dotenv').config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (inputText) => {
  const messages = [
    {
      role: "system",
      content: "あなたは栄養士であり、ダイエット向けの500kcal以内レシピを2つ提案するAIです。同じレシピを繰り返さないように注意してください。"
    },
    {
      role: "user",
      content: `以下の食材があります：${inputText}。この条件でレシピを2つ提案してください。`
    }
  ];

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0.7
  });

  return chatCompletion.choices[0].message.content;
};
