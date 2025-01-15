const assert = require("assert");
const axios = require('axios');


describe('Generates video by combining images and voiceover', function() {
  const names = [
    "Albert Pujols",
  ];

  it('should run the generate video script', async function() {
    this.timeout(60000); // Set timeout to 60 seconds (60000 milliseconds)

    try {
      const response = await axios.post('http://localhost:3000/generate-video', { names });
      assert.equal(response.status, 200);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      assert.fail('Failed to run the generated files script');
    }
  });
});