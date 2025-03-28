const express = require('express');
require('dotenv').config();
const OpenAI = require('openai');
const path = require('path');
const { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsCommand } = require('@aws-sdk/client-s3');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const events = require('events');
const eventEmitter = new events.EventEmitter();

const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize the S3 client
const s3 = new S3Client({ region: 'us-east-2' }); // Replace with your bucket's region

// SSE endpoint
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const onGenerateComplete = (message) => {
    res.write(`data: ${JSON.stringify(message)}\n\n`);
  };

  eventEmitter.on('generateComplete', onGenerateComplete);

  // Clean up the listener when the connection is closed
  req.on('close', () => {
    eventEmitter.removeListener('generateComplete', onGenerateComplete);
  });
});

function capitalizeWords(input) {
  return input
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Helper function to convert stream to string
async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate files
async function generateFiles(names, topic) {
  console.log('Generating files for:', names);

  try {
    // Emit progress update for scraping articles
    eventEmitter.emit('generateComplete', { status: 'progress', step: 'scrapeArticles', message: 'Scraping wiki article.' });
    await scrapeArticles(names, topic);
    eventEmitter.emit('generateComplete', { status: 'progress', step: 'scrapeArticlesSuccess', message: 'Articles scraped successfully.' });

    // Emit progress update for generating text and audio
    eventEmitter.emit('generateComplete', { status: 'progress', step: 'generateTextAndAudio', message: 'Generating text and audio.' });
    await generateTextAndAudio(names, topic);
    eventEmitter.emit('generateComplete', { status: 'progress', step: 'generateTextAndAudioSuccess', message: 'Text and audio generated successfully.' });

    // Emit progress update for generating images
    eventEmitter.emit('generateComplete', { status: 'progress', step: 'generateImage', message: 'Scraping images.' });
    await generateImage(names, topic);
    eventEmitter.emit('generateComplete', { status: 'progress', step: 'generateImageSuccess', message: 'Images generated successfully.' });

    // Emit final success message
    console.log('Finished generating files.');
    eventEmitter.emit('generateComplete', { status: 'success', topic, names });
  } catch (error) {
    console.error('Error in generateFiles:', error);
    eventEmitter.emit('generateComplete', { status: 'error', error: error.message });
    throw error;
  }
}

// Function to scrape articles
async function scrapeArticles(nameArr, topic) {
  console.log('Scraping articles for:', nameArr);

  try {
    const pythonPath = path.join(__dirname, '../.venv/Scripts/python.exe'); // Path to Python in virtual environment
    const scriptPath = path.join(__dirname, '../scripts/scrape_wikipedia.py');
    const command = `${pythonPath} ${scriptPath} "${nameArr.join(' ')}" "${topic}"`;

    console.log('Executing command:', command);

    // Use execPromise to wait for the script to finish
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }

    console.log(`stdout: ${stdout}`);
  } catch (error) {
    console.error('ErrorSA2:', error);
    throw error;
  }
}

// Function to generate text and audio
async function generateTextAndAudio(nameArr, topic) {
  console.log('Generating text and audio for:', nameArr);

  for (const name of nameArr) {
    try {
      const fileName = name.replace(/\s/g, '');
      const s3KeyInput = `scraped-articles/${topic}/${fileName}.txt`;
      const s3KeyOutput = `scripts/${topic}/${fileName}.txt`;

      console.log('Fetching file from S3 with key:', s3KeyInput);

      // Fetch the file content from S3
      const s3ParamsInput = {
        Bucket: 'make-my-pod',
        Key: s3KeyInput,
      };

      let fileContent;
      try {
        const s3Object = await s3.send(new GetObjectCommand(s3ParamsInput));
        fileContent = await streamToString(s3Object.Body);
      } catch (error) {
        if (error.name === 'NoSuchKey') {
          console.error(`File not found in S3: ${s3KeyInput}`);
          continue; // Skip to the next name
        }
        throw error; // Re-throw other errors
      }

      // Prepare the prompt
      const prompt = `Use the following text to create a script for an essay to be read aloud: \n\n${fileContent}`;

      // Call the OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'developer', content: 'You are a creative writer. You are creating a script based on a .txt file that will then be read out loud. Please respond solely with what you will say as the narrator of the script, with no scene directions. It is vital to keep your response to under 4500 characters.' },
          { role: 'user', content: prompt },
        ],
      });

      const generatedText = response.choices[0]?.message?.content;
      if (!generatedText) {
        throw new Error('No text generated by OpenAI API');
      }

      // Upload the generated text to S3
      const s3ParamsOutput = {
        Bucket: 'make-my-pod',
        Key: s3KeyOutput,
        Body: generatedText,
        ContentType: 'text/plain',
        ACL: 'private',
      };

      await s3.send(new PutObjectCommand(s3ParamsOutput));
      console.log(`Generated text uploaded to s3://make-my-pod/${s3KeyOutput}`);

      // Generate audio from the text
      await textToSpeech(generatedText, fileName, topic);
    } catch (error) {
      console.error('ErrorGTAA1:', error);
    }
  }
}

// Function to generate audio and upload to S3
async function textToSpeech(text, fileName, topic) {
  console.log('Start text-to-speech for:', fileName);

  try {
    // Generate the MP3 audio using OpenAI API
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Define the S3 key for the MP3 file
    const s3Key = `mp3s/${topic}/${fileName}.mp3`;

    // Upload the MP3 file to S3
    const s3Params = {
      Bucket: 'make-my-pod',
      Key: s3Key,
      Body: buffer,
      ContentType: 'audio/mpeg',
      ACL: 'private',
    };

    await s3.send(new PutObjectCommand(s3Params));
    console.log(`Audio file uploaded to s3://make-my-pod/${s3Key}`);
  } catch (error) {
    console.error('Error in text-to-speech:', error);
  }
}

async function generateImage(nameArr, topic) {
  console.log('Generating image for:', nameArr);

  // Replace spaces with underscores in names and topic
  const sanitizedNames = nameArr.map((name) => name.replace(/\s/g, '_'));
  const sanitizedTopic = topic.replace(/\s/g, '_');

  try {
    const pythonPath = path.join(__dirname, '../.venv/Scripts/python.exe'); // Path to Python in virtual environment
    const scriptPath = path.join(__dirname, '../scripts/scrape_images.py');
    const command = `${pythonPath} ${scriptPath} "${sanitizedNames.join(' ')}" "${sanitizedTopic}"`;

    console.log('Executing command:', command);

    // Use execPromise to wait for the script to finish
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }

    console.log(`stdout: ${stdout}`);
  } catch (error) {
    console.error('Error in generateImage:', error);
    throw error;
  }
}

// API endpoint to generate files
app.post('/generate-files', async (req, res) => {
  let { name, topic } = req.body;

  console.log('Request payload before capitalization:', req.body);

  // Normalize and capitalize `name` and `topic`
  const nameArr = Array.isArray(name) ? name.map(capitalizeWords) : [capitalizeWords(name)];
  topic = capitalizeWords(topic);

  console.log('Capitalized nameArr:', nameArr);
  console.log('Capitalized topic:', topic);

  try {
    await generateFiles(nameArr, topic);
    res.status(200).send('Text and audio generated successfully');
  } catch (error) {
    console.error('Error in /generate-files:', error);
    res.status(500).send(`Error generating text and audio: ${error}`);
  }
});

// API endpoint to get the list of generated files
app.get('/list-files', async (req, res) => {
  const s3Params = {
    Bucket: 'make-my-pod',
    Prefix: 'mp3s/',
  };

  try {
    const data = await s3.send(new ListObjectsCommand(s3Params));

    // Extract unique topic names from the keys
    const topics = Array.from(
      new Set(
        data.Contents
          .map(file => file.Key) // Get the full key
          .filter(key => key !== 'mp3s/') // Exclude the root prefix
          .map(key => key.replace('mp3s/', '').split('/')[0]) // Extract the topic name
      )
    );

    console.log('List of topics:', topics);

    res.status(200).json(topics);
  } catch (error) {
    console.error('Error in /list-files:', error);
    res.status(500).send(`Error listing files: ${error}`);
  }
});

// API endpoint to get the list of generated files for a specific topic
app.get('/list-files/:topic', async (req, res) => {
  const { topic } = req.params;
  const s3Params = {
    Bucket: 'make-my-pod',
    Prefix: `mp3s/${topic}/`,
  };

  try {
    const data = await s3.send(new ListObjectsCommand(s3Params));

    // Extract file names from the keys, format them, and remove the .mp3 extension
    const files = data.Contents.map(file => {
      const fileName = file.Key.replace(`mp3s/${topic}/`, '') // Remove the prefix
        .replace('.mp3', '') // Remove the .mp3 extension
        .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add a space between camel case words
      return fileName;
    });

    console.log(`List of files for topic ${topic}:`, files);

    res.status(200).json(files);
  } catch (error) {
    console.error('Error in /list-files/:topic:', error);
    res.status(500).send(`Error listing files for topic ${topic}: ${error}`);
  }
});

// API endpoint to get the audio file for a specific topic and file name
app.get('/get-file/:topic/:fileName', async (req, res) => {
  const { topic, fileName } = req.params;
  const s3Key = `mp3s/${topic}/${fileName}.mp3`;
  const s3Params = {
    Bucket: 'make-my-pod',
    Key: s3Key,
  };

  try {
    const s3Object = await s3.send(new GetObjectCommand(s3Params));
    const audioStream = s3Object.Body;

    res.set('Content-Type', 'audio/mpeg');
    audioStream.pipe(res);
  } catch (error) {
    console.error('Error in /get-file/:topic/:fileName:', error);
    res.status(500).send(`Error getting file ${fileName}.mp3 for topic ${topic}: ${error}`);
  }
});

// API endpoint to get the text file for a specific topic and file name
app.get('/get-text/:topic/:fileName', async (req, res) => {
  const { topic, fileName } = req.params;
  const s3Key = `scripts/${topic}/${fileName}.txt`;
  const s3Params = {
    Bucket: 'make-my-pod',
    Key: s3Key,
  };

  try {
    const s3Object = await s3.send(new GetObjectCommand(s3Params));
    const text = await streamToString(s3Object.Body);

    res.status(200).send(text);
  } catch (error) {
    console.error('Error in /get-text/:topic/:fileName:', error);
    res.status(500).send(`Error getting text file ${fileName}.txt for topic ${topic}: ${error}`);
  }
});

// API endpoint to get the image file for a specific topic and file name
app.get('/get-image/:topic/:fileName', async (req, res) => {
  const { topic, fileName } = req.params;
  // Replace spaces with underscores in the file name
  const sanitizedFileName = fileName.replace(/\s/g, '_');

  // Construct the S3 key based on the new format
  const s3Key = `images/${topic}/${sanitizedFileName.replace(' ', '_')}/${sanitizedFileName}_1.jpeg`;
  const s3Params = {
    Bucket: 'make-my-pod',
    Key: s3Key,
  };

  try {
    const s3Object = await s3.send(new GetObjectCommand(s3Params));
    const imageStream = s3Object.Body;

    res.set('Content-Type', 'image/jpeg');
    imageStream.pipe(res);
  } catch (error) {
    console.error('Error in /get-image/:topic/:fileName:', error);
    res.status(500).send(`Error getting image file ${fileName}_1.jpeg for topic ${topic}: ${error}`);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});