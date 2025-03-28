const eventEmitter = require('../utils/eventEmitter');

exports.eventsHandler = (req, res) => {
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
};