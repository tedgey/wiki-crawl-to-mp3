const express = require('express');
const cors = require('cors');
const eventsRoutes = require('./routes/events');
const generateRoutes = require('./routes/generate');
const filesRoutes = require('./routes/files');
const imagesRoutes = require('./routes/images');
const textRoutes = require('./routes/text');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/events', eventsRoutes);
app.use('/generate-files', generateRoutes);
app.use('/list-files', filesRoutes);
app.use('/get-image', imagesRoutes);
app.use('/get-text', textRoutes);

module.exports = app;