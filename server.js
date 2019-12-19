var express = require("express");
var path = require("path");
var nodemailer = require("nodemailer");
var xoauth2 = require('xoauth2');
var bodyParser = require("body-parser");

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const GMAIL_ACCESS_TOKEN = process.env.GMAIL_ACCESS_TOKEN;

require('dotenv').config();

var app = express();
var PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/assets/html/index.html"));
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

app.post('/contact', (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: GMAIL_USER,
            clientId: GMAIL_CLIENT_ID,
            clientSecret: GMAIL_CLIENT_SECRET,
            refreshToken: GMAIL_REFRESH_TOKEN,
            accessToken: GMAIL_ACCESS_TOKEN,
        },
    });

    const mailOpts = {
        from: GMAIL_USER,
        to: req.body.email,
        subject: 'Nuevo mensaje del formulario de contacto del sitio web de CEVI',
        text: `${req.body.name} (${req.body.email}) dice: ${req.body.message}`
    }

    transporter.sendMail(mailOpts, (error, response) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent");
            transporter.close();
        }
    })
});