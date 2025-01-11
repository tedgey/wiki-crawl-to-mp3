TLDR: You can take a list of names and generate a youtube-style video essay based off of their wikipedia 
article, as well as download x (default 10) pictures of each person listed- all at the click of a button.

How to use:
1. go into grabData.spec.js and adjust the "names" array to include the names of the files you want to crawl.
2. npm start to start the server
3. run the mocha test to scrape the data (in UI or in terminal). *This will automatically download files into their dedicated folders.*

    ```npm test```

This will generate text, create tts mp3s of each text, and snag 10 images of each person listed.

