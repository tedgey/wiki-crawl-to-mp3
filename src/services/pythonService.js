const path = require('path');
const util = require('util');
const { exec } = require('child_process');
const execPromise = util.promisify(exec);

async function scrapeArticles(names, topic) {
  const pythonPath = path.join(__dirname, '../../.venv/Scripts/python.exe');
  const scriptPath = path.join(__dirname, '../../scripts/scrape_wikipedia.py');
  const command = `${pythonPath} ${scriptPath} "${names.join(' ')}" "${topic}"`;

  console.log('Executing command:', command);

  const { stdout, stderr } = await execPromise(command);
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  console.log(`stdout: ${stdout}`);
}

async function generateImage(names, topic) {
  const pythonPath = path.join(__dirname, '../../.venv/Scripts/python.exe');
  const scriptPath = path.join(__dirname, '../../scripts/scrape_images.py');
  const command = `${pythonPath} ${scriptPath} "${names.join(' ')}" "${topic}"`;

  console.log('Executing command:', command);

  const { stdout, stderr } = await execPromise(command);
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  console.log(`stdout: ${stdout}`);
}

module.exports = { scrapeArticles, generateImage };