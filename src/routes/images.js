const express = require('express')
const { getImageFile } = require('../controllers/imageController')

const router = express.Router()

// Endpoint to get an image file
router.get('/:topic/:fileName', getImageFile)

module.exports = router
