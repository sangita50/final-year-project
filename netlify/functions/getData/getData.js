const OpenAI = require('openai');

const anyscale = new OpenAI({
  baseURL: "https://api.endpoints.anyscale.com/v1",
  apiKey: 'esecret_i2gu4jzabcetf6513cp23xrdcv'
//   apiKey: process.env.API_KEY
});

async function chatCompletion(input) {
  console.log(input);
  const completion = await anyscale.chat.completions.create({
    model: "mistralai/Mistral-7B-Instruct-v0.1",
    messages: input,
    temperature: 0.1,
  });
  return completion.choices[0]?.message?.content;
}

exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {      
    const { messages } = JSON.parse(event.body);
    const answer = await chatCompletion(messages);
    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }
};