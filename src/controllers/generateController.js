const { generateFiles } = require('../services/generateService');
const capitalizeWords = require('../utils/capitalizeWords');

exports.generateFilesHandler = async (req, res) => {
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
    res.status(500).send(`Error generating text and audio: ${error.message}`);
  }
};