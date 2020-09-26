require('dotenv').config();
const tts = require('./index.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static('client/build'));
}
app.get('*',(req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});
 
app.post('/', function(req, res){
    // res.send('Hello World!');
  tts.speech({
      key: process.env.API_KEY,
      hl: 'en-us',
      v: 'Linda',
      // src: 'Hello, World!',
      src: req.body.joke,
      r: 0,
      c: 'mp3',
      f: '44khz_16bit_stereo',
      ssml: false,
      b64: false,
      callback: function (error, content) {
        // https://stackoverflow.com/questions/28440369/rendering-a-base64-png-with-express
        var audio = Buffer.from(content, 'base64');

        res.writeHead(200, {
          'Content-Type': 'audio/mp3',
        });
        res.end(audio); 
      }
  });
});
 
app.listen(process.env.PORT || 8000);