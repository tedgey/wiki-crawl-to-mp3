const { getTextFileFromS3 } = require('../services/s3Service');

exports.getTextFile = async (req, res) => {
  const { topic, fileName } = req.params;

  try {
    const text = await getTextFileFromS3(topic, fileName);
    res.status(200).send(text);
  } catch (error) {
    console.error('Error in /get-text/:topic/:fileName:', error);
    res.status(500).send(`Error getting text file ${fileName}.txt for topic ${topic}: ${error.message}`);
  }
};