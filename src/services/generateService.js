const eventEmitter = require('../utils/eventEmitter')
const { scrapeArticles, generateImage } = require('./pythonService')
const { generateText, generateAudio } = require('./openaiService')
const { uploadToS3 } = require('./s3Service')

exports.generateFiles = async (names, topic) => {
  console.log('Generating files for:', names)

  try {
    // Step 1: Scrape articles
    eventEmitter.emit('generateComplete', {
      status: 'progress',
      step: 'scrapeArticles',
      message: 'Scraping wiki articles.',
    })
    await scrapeArticles(names, topic)
    eventEmitter.emit('generateComplete', {
      status: 'progress',
      step: 'scrapeArticlesSuccess',
      message: 'Articles scraped successfully.',
    })

    // Step 2: Generate text and audio
    for (const name of names) {
      const fileName = name.replace(/\s/g, '')
      const prompt = `Use the following text to create a script for an essay to be read aloud: \n\n${name}`

      eventEmitter.emit('generateComplete', {
        status: 'progress',
        step: 'generateText',
        message: `Generating text for ${name}.`,
      })
      const generatedText = await generateText(prompt)

      const textKey = `scripts/${topic}/${fileName}.txt`
      await uploadToS3('make-my-pod', textKey, generatedText, 'text/plain')
      eventEmitter.emit('generateComplete', {
        status: 'progress',
        step: 'generateTextSuccess',
        message: `Text generated for ${name}.`,
      })

      eventEmitter.emit('generateComplete', {
        status: 'progress',
        step: 'generateAudio',
        message: `Generating audio for ${name}.`,
      })
      const audioBuffer = await generateAudio(generatedText)

      const audioKey = `mp3s/${topic}/${fileName}.mp3`
      await uploadToS3('make-my-pod', audioKey, audioBuffer, 'audio/mpeg')
      eventEmitter.emit('generateComplete', {
        status: 'progress',
        step: 'generateAudioSuccess',
        message: `Audio generated for ${name}.`,
      })
    }

    // Step 3: Generate images
    eventEmitter.emit('generateComplete', {
      status: 'progress',
      step: 'generateImage',
      message: 'Generating images.',
    })
    await generateImage(names, topic)
    eventEmitter.emit('generateComplete', {
      status: 'progress',
      step: 'generateImageSuccess',
      message: 'Images generated successfully.',
    })

    // Final success
    eventEmitter.emit('generateComplete', { status: 'success', topic, names })
  } catch (error) {
    console.error('Error in generateFiles:', error)
    eventEmitter.emit('generateComplete', {
      status: 'error',
      error: error.message,
    })
    throw error
  }
}
