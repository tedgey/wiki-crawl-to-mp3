const express = require('express');
require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs'); 
const path = require('path');
const { exec } = require('child_process'); // Add this line

const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateFiles(names, topic) {
  const directories = [
    '../content',
    '../content/generated_text',
    '../content/generated_audio',
    `../content/generated_audio/${topic}`,
    '../images',
    `../images/${topic}`
  ];

  directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  });

  Promise.all([
    await scrapeArticles(names),
    await generateTextAndAudio(names, topic)
  ]);

  // await scrapeImages(names, topic);
}

async function scrapeArticles(nameArr) {
  console.log('Scraping articles for:', nameArr);
  const scrapedArticlesDir = path.join(__dirname, '../content/scraped_articles');
  if (!fs.existsSync(scrapedArticlesDir)) {
    fs.mkdirSync(scrapedArticlesDir);
  }

  try {
    // Use the Python executable from the virtual environment
    const pythonPath = path.join(__dirname, '../.venv/Scripts/python.exe'); // Path to .venv Python
    const scriptPath = path.join(__dirname, '../scripts/scrape_wikipedia.py');
    const command = `${pythonPath} ${scriptPath} "${nameArr}"`; // Pass names as arguments

    console.log('Command:', command); // Debugging: Log the command being executed

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`ErrorSA1: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  } catch (error) {
    console.error("ErrorSA2:", error);
  }
}

async function generateTextAndAudio(nameArr, topic) {
  console.log('Generating text and audio for:', nameArr);
  // Loop through the name array to generate text for each name
  //if scraped_articles folder does not exist, create it
  const scrapedArticlesDir = path.join(__dirname, '../content/scraped_articles');
  if (!fs.existsSync(scrapedArticlesDir)) {
    fs.mkdirSync(scrapedArticlesDir);
  }

  for (const name of nameArr) {
    try {
      // Read the content of the text file
      console.log('Processing name:', name); // Debugging: Log the name being processed
      let fileName = name.replace(/\s/g, '');
      const fileContent = fs.readFileSync(path.join(__dirname, `../content/scraped_articles/${fileName}.txt`), "utf-8");

      // Prepare the prompt
      const prompt = `Use the following text to create a script for a youtube essay: \n\n${fileContent}`;

      // Call the OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "developer", content: "You are a creative writer and youtuber. You will be presenting a video essay based on a txt file. Please respond solely with what you will say as the narrator of the script, with no scene directions. It is vital to keep your response to under 4000 characters." },
          { role: "user", content: prompt}
        ]
      });

      // Extract and log the generated text
      const generatedText = response.choices[0]?.message?.content;
      if (!generatedText) {
        throw new Error('No text generated by OpenAI API');
      }

      await textToSpeech(generatedText, fileName, topic);
      // Save the generated text to a file
      fs.writeFileSync(path.join(__dirname, `../content/generated_text/${fileName}.txt-script`), generatedText);
    } catch (error) {
      console.error("ErrorGTAA1:", error);
    }
  }
}

async function textToSpeech(text, fileName, topic) {
  console.log('start text to speech', fileName);
  const speechFile = path.resolve(__dirname, `../content/generated_audio/${topic}/${fileName}.mp3`);
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
  console.log('Audio file saved:', speechFile);
}

async function scrapeImages(args = [], topic) {
  // Access scrape_images.py in the scripts folder and pass in the names array
  const quotedArgs = args.map(name => `"${name}"`).join(' ');

  exec(`python3 ${path.join(__dirname, '../scripts/scrape_images.py')} ${quotedArgs} ${topic}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`ErrorSI1: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

app.post('/generate-files', async (req, res) => {
  let { name, topic } = req.body;

  console.log('Request payload:', req.body);

  // Normalize `name` to always be an array of strings
  const nameArr = Array.isArray(name) ? name : [name];

  console.log('Normalized nameArr:', nameArr);
  console.log('topic:', topic);

  try {
    await generateFiles(nameArr, topic);
    res.status(200).send('Text and audio generated successfully');
  } catch (error) {
    res.status(500).send(`Error generating text and audio: ${error}`);
  }
});

app.post('/generate-images', async (req, res) => {
  let { nameArr, topic } = req.body;

  try {
    await scrapeImages(nameArr, topic);
    res.status(200).send('Images generated successfully');
  } catch (error) {
    res.status(500).send(`Error generating images: ${error}`);
  }
});

app.post('/generate-video', async (req, res) => {
  let { nameArr } = req.body;

  try {

    exec(`python3 ${path.join(__dirname, '../scripts/combine.py')} ${ nameArr } `, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });

    res.status(200).send('Video generated successfully');
  } catch (error) {
    res.status(500).send(`Error generating video: ${error}`);
  }
}),

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});