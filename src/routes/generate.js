const express = require('express')
const { generateFilesHandler } = require('../controllers/generateController')

const router = express.Router()

// Endpoint to generate files
router.post('/', generateFilesHandler)

module.exports = router
