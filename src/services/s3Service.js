const { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsCommand } = require('@aws-sdk/client-s3');
const streamToString = require('../utils/streamToString');

const s3 = new S3Client({ region: 'us-east-2' }); // Replace with your bucket's region

// List all topics in the S3 bucket
exports.listFilesFromS3 = async () => {
  const s3Params = { Bucket: 'make-my-pod', Prefix: 'mp3s/' };

  const data = await s3.send(new ListObjectsCommand(s3Params));
  return Array.from(
    new Set(
      data.Contents
        .map(file => file.Key.replace('mp3s/', '').split('/')[0]) // Extract topic names
    )
  );
};

// List files for a specific topic
exports.listFilesByTopicFromS3 = async (topic) => {
  const s3Params = { Bucket: 'make-my-pod', Prefix: `mp3s/${topic}/` };

  const data = await s3.send(new ListObjectsCommand(s3Params));
  return data.Contents.map(file => file.Key.replace(`mp3s/${topic}/`, '') // Remove the prefix
  .replace('.mp3', '') // Remove the .mp3 extension
  .replace(/([a-z])([A-Z])/g, '$1 $2')
 ); // Add a space between camel case words
};

// Get a text file from S3
exports.getTextFileFromS3 = async (topic, fileName) => {
  fileName = fileName.replace(/\s/g, '');
  const s3Params = { Bucket: 'make-my-pod', Key: `scripts/${topic}/${fileName}.txt` };
  const s3KeyInput = `scraped-articles/${topic}/${fileName}.txt`;
      const s3KeyOutput = `scripts/${topic}/${fileName}.txt`;

  const s3Object = await s3.send(new GetObjectCommand(s3Params));
  return streamToString(s3Object.Body);
};

// Get an image file from S3
exports.getImageFromS3 = async (topic, fileName) => {
  const sanitizedFileName = fileName.replace(/\s/g, '_');
  const s3Key = `images/${topic}/${sanitizedFileName.replace(' ', '_')}/${sanitizedFileName}_1.jpeg`;
  const s3Params = { Bucket: 'make-my-pod', Key: s3Key };
  const s3Object = await s3.send(new GetObjectCommand(s3Params));
  return s3Object.Body;
};

// Upload a file to S3
exports.uploadToS3 = async (bucket, key, body, contentType) => {
  const s3Params = {
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    ACL: 'private',
  };

  await s3.send(new PutObjectCommand(s3Params));
};