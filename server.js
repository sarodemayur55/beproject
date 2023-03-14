const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const path = require('path');





const whitelist = ['http://localhost:3000', 'http://developer2.com','https://ets-9hwzzfgyb-sarodemayur55.vercel.app','https://ets-1yxl0oqw0-sarodemayur55.vercel.app','https://ets-sarodemayur55.vercel.app']
app.use(function (req, res, next) {
  const corsWhitelist = [
    'https://ets-9hwzzfgyb-sarodemayur55.vercel.app',
    'http://localhost:3000',
    'https://ets-1yxl0oqw0-sarodemayur55.vercel.app',
    'https://ets-sarodemayur55.vercel.app'
];
  // Website you wish to allow to connect
  if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
}
  // res.setHeader('Access-Control-Allow-Origin', 'https://ets-9hwzzfgyb-sarodemayur55.vercel.app');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, withCredentials');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error())
    }
  }
  ,credentials: true
}
app.options('*', cors(corsOptions));









// const options = {
//   origin: 'http://localhost:3000',
//   }
//   app.use(cors(options))
require("./config/database").connect();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.urlencoded({extended:false}));
// app.use(cookieParser());



var passport = require('passport');
// var expressSession = require('express-session');
// TODO - Why Do we need this key ?


// app.use(cookieParser());
// app.use(bodyParser.json());

app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, // one day in miliseconds
  name: 'session',
  secure:false,
  keys: ['key1', 'key2']
}));
// app.use(expressSession({
//   secret: 'abcdefg',
//   resave: true,
//   saveUninitialized: true,
//   cookie: { maxAge: 60 * 60 * 1000 }
// }));
app.use(passport.initialize());
app.use(passport.session());



// app.use(expressSession({
//   secret: 'mySecretKey',
//   resave: true,
//   saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);
var routes = require('./routes/index')(passport);



app.use(express.static(path.resolve(__dirname, './build')));
app.use('/api', routes);

const port = process.env.PORT || 5000;
app.get('*',(req, res) => {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
})
app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});