const { getImageFromS3 } = require('../services/s3Service')

exports.getImageFile = async (req, res) => {
  const { topic, fileName } = req.params

  try {
    const imageStream = await getImageFromS3(topic, fileName)
    res.set('Content-Type', 'image/jpeg')
    imageStream.pipe(res)
  } catch (error) {
    console.error('Error in /get-image/:topic/:fileName:', error)
    res
      .status(500)
      .send(
        `Error getting image file ${fileName}_1.jpeg for topic ${topic}: ${error.message}`
      )
  }
}

// app.get('/get-image/:topic/:fileName', async (req, res) => {
//   const { topic, fileName } = req.params;
//   // Replace spaces with underscores in the file name
//   const sanitizedFileName = fileName.replace(/\s/g, '_');

//   // Construct the S3 key based on the new format
//   const s3Key = `images/${topic}/${sanitizedFileName.replace(' ', '_')}/${sanitizedFileName}_1.jpeg`;
//   const s3Params = {
//     Bucket: 'make-my-pod',
//     Key: s3Key,
//   };

//   try {
//     const s3Object = await s3.send(new GetObjectCommand(s3Params));
//     const imageStream = s3Object.Body;

//     res.set('Content-Type', 'image/jpeg');
//     imageStream.pipe(res);
//   } catch (error) {
//     console.error('Error in /get-image/:topic/:fileName:', error);
//     res.status(500).send(`Error getting image file ${fileName}_1.jpeg for topic ${topic}: ${error}`);
//   }
// });
