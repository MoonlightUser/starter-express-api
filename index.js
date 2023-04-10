const cors = require('cors');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jsdom = require('jsdom')
const dom = new jsdom.JSDOM("")
const $ = require('jquery')(dom.window)

// const CLIENT_URL = 'http://ivy.and.tymurblog.com' // production url
const CLIENT_URL = 'http://127.0.0.1:5500' // development url

//php urls
const CREATE_TOKEN_URL = '/diplom-chess/database/create-token.php'

app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json()) 
// app.use(cors({
//     origin: CLIENT_URL,
// }));

app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }))
app.all('/', (req, res) => {
    console.log("Just got a request!")  
    res.send('Yo!')
})

app.post('/create-token', (req, res) => {
    console.log("Just got a request to create token!") 
    const username = JSON.stringify(req.body.username);
    const password = JSON.stringify(req.body.password);

    $.ajax({
        url: CLIENT_URL+CREATE_TOKEN_URL,
        dataType:'json',
        method:'post',
        data: { username, password},
        success: function (response) {
            console.log("success");
            res.send(response)
        },
        error: function (xhr, status, error) {
            console.log(xhr);
            console.log(CLIENT_URL+CREATE_TOKEN_URL);
            res.send(xhr)
        }
    });
})
app.listen(process.env.PORT || 3000)