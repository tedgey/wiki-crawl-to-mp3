const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Generate text using OpenAI
exports.generateText = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a creative writer. You are creating a script based on a .txt file that will then be read out loud. Please respond solely with what you will say as the narrator of the script, with no scene directions. It is vital to keep your response to under 4500 characters.',
      },
      { role: 'user', content: prompt },
    ],
  })

  const generatedText = response.choices[0]?.message?.content
  if (!generatedText) {
    throw new Error('No text generated by OpenAI API')
  }

  return generatedText
}

// Generate audio using OpenAI
exports.generateAudio = async (text) => {
  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: text,
  })

  return Buffer.from(await response.arrayBuffer())
}
