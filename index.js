const cors = require('cors');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jsdom = require('jsdom')
const dom = new jsdom.JSDOM("")
const $ = require('jquery')(dom.window)

const validate = require("validate.js");
const { contains } = require('jquery');
const e = require('cors');
const constraints = {
    username: {
        length: {
            minimum: 3,
            maximum: 20,
        }
    },
    password: {
        length: {
            minimum: 6,
        }
    },
};

const CLIENT_URL = 'http://ivy.and.tymurblog.com' // production url
// const CLIENT_URL = 'http://127.0.0.1:5500' // development url

//php urls
const CREATE_TOKEN_URL = '/database/create-token.php'
const READ_TOKEN_URL = '/database/read-token.php'
const GET_USERS_URL = '/database/get-users.php'
const ADD_USER_URL = '/database/add-user.php'

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
        method:'post',
        data: { username, password},
        success: function (response) {
            console.log("success in create-token");
            console.log(response);
            res.send(response)
        },
        error: function (xhr, status, error) {
            console.log("error in create-token");
            console.log(xhr);
            res.send(xhr)
        }
    });
})

app.post('/read-token', (req, res) => {
    console.log("Just got a request to read token!") 
    const token = req.body.token
    $.ajax({
        url: CLIENT_URL+READ_TOKEN_URL,
        method:'post',
        data: { token},
        success: function (response) {
            console.log("success in read-token");
            res.send(response)
        },
        error: function (xhr, status, error) {
            console.log("error in read-token");
            console.log(xhr);
            res.send(xhr)
        }
    });
})

app.post('/get-users', (req, res) => {
    console.log("Just got a request to get users!")
    $.ajax({
        url: CLIENT_URL+GET_USERS_URL,
        method:'post',
        success: function (response) {
            console.log("success in get-users");
            res.send(response)
        },
        error: function (xhr, status, error) {
            console.log("error in get-users");
            console.log(xhr);
            res.send(xhr)
        }
    });
})



app.post('/add-user', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let repeatPassword = req.body.repeatPassword
    let email = req.body.email
    console.log("Just got a request to add user!");
    console.log("username: " + username);
    console.log("password: " + password);
    console.log("repeatPassword: " + repeatPassword);
    console.log("email: " + email);
    console.log(constraints);

    // validation
    if (password.length < constraints.password.length.minimum || password.length > constraints.password.length.maximum) {
        console.log("password is not valid");
        res.send("4")
    }
    else if (password !== repeatPassword) {
        console.log("passwords do not match");
        res.send("3")
    }
    else if (username.length < constraints.username.length.minimum) {
        console.log("username is not valid");
        res.send("5")
    }
    else if (!email.includes("@")) {
        console.log("email is not valid");
        res.send("6")
    }
    else {
        $.ajax({
            url: CLIENT_URL+GET_USERS_URL,
            method:'post',
            success: function (response) {
                console.log("success in get-users");
                const users = JSON.parse(response);
                let isUserValid = true;
                for(let i = 0; i < users.length; i++) {
                    if (users[i].name === username) {
                        console.log("username is already taken");
                        res.send("2")
                        isUserValid = false;
                        break;
                    }
                    else if (users[i].email === email) {
                        console.log("email is already taken");
                        res.send("7")
                        isUserValid = false;
                        break;
                    }
                }
                if (isUserValid) {
                    $.ajax({
                        url: CLIENT_URL+ADD_USER_URL,
                        method:'post',
                        data: {username, password, email},
                        success: function (response) {
                            console.log("success in add-user");
                            res.send("1")
                        },
                        error: function (xhr, status, error) {
                            console.log("error in add-user");
                            console.log(xhr);
                            res.send("8")
                        }
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("error in get-users");
                console.log(xhr);
            }
        });

        // const 
    }

})

app.post('/find-user', (req, res) => {
    console.log("Just got a request to login!")
    $.ajax({
        url: CLIENT_URL+GET_USERS_URL,
        method:'post',
        success: function (response) {
            console.log("success in get-users");
            const users = JSON.parse(response);
            const username = req.body.username;
            const password = req.body.password;
            let isUserFouded = false;
            for (let i = 0; i < users.length; i++) {
                if (users[i].name === username && users[i].password === password) {
                    console.log("user found");
                    isUserFouded = true;
                    res.send("1")
                    break
                }
                else if (users[i].name === req.body.username && users[i].password !== req.body.password) {
                    console.log("wrong password");
                    isUserFouded = true;
                    res.send("2")
                    break
                }
            }
            if (!isUserFouded) {
                console.log("user not found");
                res.send("3")
            }
        },
        error: function (xhr, status, error) {
            console.log("error in get-users");
            console.log(xhr);
            res.send(xhr)
        }
    });
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})


