const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');
const clientURL = "http://ivy.and.tymurblog.com"
// const clientURL = "http://127.0.0.1:5501" //for testing
const getPixelsAPI = "/getPixels.php"
const safePixelAPI = "/insertPixels.php"

app.use(express.static('public'));
app.use(cors({
    origin: clientURL,
}));
app.listen(3000, () => {
    console.log('Express intro running on localhost:3000');
});

app.post('/my-sql-get', (req, res) => {
  console.log("I was triggered to get data");
  getPixels()
    .then(response => {
      response = JSON.stringify(response);
      console.log(response);

        return res.send(response);
      });   
});

// app.post('/my-sql-post', (req, res) => {
//   console.log("I was triggered to post data");
//   safePixel(res)
// .then(response => {
//     console.log(response);
//   });   
// });



async function getPixels() {
  try {
    const response = await fetch(clientURL+getPixelsAPI);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// async function safePixel(x, y, color) {
//   const pixel = "x=" + x + "&y=" + y + "&color=" + color;
//   console.log(pixel);
//   try {
//       const response = await fetch("http://tymurblog.com/chess/insertPixels.php?" + pixel);
//       const data = await response.json();
//       console.log((data));
//       return data;
//   } catch (error) {
//       console.error('Error:', error);
//   }
// }


// app.post('/trigger-event', (req, res) => {
// console.log("I was triggered to change color")
//   const { color } = req.body;
//   pusher.trigger('my-chess', 'change-color', { color });
//   res.sendStatus(200);
// });

// app.post('/clear', (req, res) => {
//   console.log("I was triggered to clear")
//   pusher.trigger('my-chess', 'clear', {});
//   res.sendStatus(200);
// })

// app.post('/draw', (req, res) => {
//   console.log("I was triggered to draw")
//   const x = req.body.x;
//   const y = req.body.y;
//   const color = req.body.color;
//   console.log(x, y, color);
//   safePixel(x, y, color)
//   pusher.trigger('my-chess', 'put-pixel', { x, y, color });
//   res.sendStatus(200);
// });

// var pusher = new Pusher({
//   appId: '1563257',
//   key: '37167ed4b28138b6fe32',
//   secret: '658bc35f8bdb05da7595',
//   cluster: 'eu',
// });

