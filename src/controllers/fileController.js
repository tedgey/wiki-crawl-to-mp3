const { listFilesFromS3, listFilesByTopicFromS3 } = require('../services/s3Service');

exports.listFiles = async (req, res) => {
  try {
    const topics = await listFilesFromS3();
    console.log('List of topics:', topics);
    res.status(200).json(topics);
  } catch (error) {
    console.error('Error in /list-files:', error);
    res.status(500).send(`Error listing files: ${error.message}`);
  }
};

exports.listFilesByTopic = async (req, res) => {
  const { topic } = req.params;
  console.log('Received topic:', topic);

  try {
    const files = await listFilesByTopicFromS3(topic);
    console.log(`List of files for topic ${topic}:`, files);
    res.status(200).json(files);
  } catch (error) {
    console.error('Error in /list-files/:topic:', error);
    res.status(500).send(`Error listing files for topic ${topic}: ${error.message}`);
  }
};