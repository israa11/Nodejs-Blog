
require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

app.use(express.static('public'))
app.use(express.static('node_modules'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 app.use(cookieParser());

app.set('view engine', 'ejs');


const adminroutes = require('./routes/admin');

app.use('/' , adminroutes);

const mainroutes = require('./routes/main');
app.use('/' , mainroutes)
const port = process.env.PORT || 3000;
app.listen (port,() => {
    console.log('server running on port 5000')
})

