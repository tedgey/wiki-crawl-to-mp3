const path = require('path')
const util = require('util')
const { execFile } = require('child_process')
const execFilePromise = util.promisify(execFile)

async function scrapeArticles(names, topic) {
  const pythonPath = path.join(__dirname, '../../.venv/Scripts/python.exe')
  const scriptPath = path.join(__dirname, '../../scripts/scrape_wikipedia.py')

  const args = [scriptPath, names.join(' '), topic]
  console.log('Executing command:', pythonPath, args)
  const { stdout, stderr } = await execFilePromise(pythonPath, args)

  if (stderr) {
    console.error(`stderr: ${stderr}`)
  }
  console.log(`stdout: ${stdout}`)
}

async function generateImage(names, topic) {
  const pythonPath = path.join(__dirname, '../../.venv/Scripts/python.exe')
  const scriptPath = path.join(__dirname, '../../scripts/scrape_images.py')

  const args = [scriptPath, names.join(' '), topic]
  console.log('Executing command:', pythonPath, args)
  const { stdout, stderr } = await execFilePromise(pythonPath, args)

  if (stderr) {
    console.error(`stderr: ${stderr}`)
  }
  console.log(`stdout: ${stdout}`)
}

module.exports = { scrapeArticles, generateImage }
