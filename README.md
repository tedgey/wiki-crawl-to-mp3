TLDR: You can take a list of names and generate a youtube-style video essay based off of their wikipedia 
article, as well as download x (default 10) pictures of each person listed- all at the click of a button.

How to use:
1. ```npm install```
2. go into grabData.spec.js and adjust the "names" array to include the names of the files you want to crawl.
3. npm start to start the server
4. run the mocha test to scrape the data (in UI or in terminal). *This will automatically download files into their dedicated folders.*

    ```npm test```

This will generate text, create tts mp3s of each text, and snag 10 images of each person listed.

5. Review content
6. Combine content with

``` python scripts/combine.py ["Albert Pujols", "Babe Ruth", "Barry Bonds", "Bob Feller", "Chipper Jones"] ``` -provide an array of names

This will produce a video with the 10 images and backing tts mp3.
