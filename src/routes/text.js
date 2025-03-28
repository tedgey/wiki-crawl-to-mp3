const express = require('express');
const { getTextFile } = require('../controllers/textController');

const router = express.Router();

// Endpoint to get a text file
router.get('/:topic/:fileName', getTextFile);

module.exports = router;