const express = require('express')
const { listFiles, listFilesByTopic } = require('../controllers/fileController')

const router = express.Router()

// Endpoint to list all topics
router.get('/', listFiles)

// Endpoint to list files for a specific topic
router.get('/:topic', listFilesByTopic)

module.exports = router
