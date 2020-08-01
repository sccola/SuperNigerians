const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');
const fileupload = require('express-fileupload');
const flash = require("connect-flash");
const dotenv = require("dotenv").config();
const logger = require("morgan");
const mongoose = require("mongoose");
const csrf = require('csurf');
// const multer = require('multer');
const indexRouter = require('./routes')
// const config = require("./config/database");
const auth = require('./routes/auth');
// const User = require('./models/user');
const postRouter = require('./routes/post');

const app = express();
const csrfProtection = csrf();

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    name: 'session',
    keys: [process.env.SESSION_COOKIEKEY],
  }),
);
// Cookie Parser
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

app.locals.moment = require('moment');


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(flash());

// seed anonymous user
require('./utils/seed');

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(csrfProtection);
app.use((req, res, next) => {
  const token = req.csrfToken();
  res.cookie('csrf-token', token);
  res.locals.csrfToken = req.csrfToken();
  res.locals.currentUser = req.session.user;
  next();
});
// express file upload
app.use(fileupload({ useTempFiles: true }));
// app.get("/", (req, res) => {
//   res.send("Welcome to Express!");
// });

const MONGO_URI = process.env.MONGODB_URI;
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
  })
  .then(() => {

    console.log("Database connected successfully");
  })
  .catch((err) => console.log("Connection to database failed =>", err));

// ************ REGISTER ROUTES HERE ********** //
app.use(auth);
app.use(indexRouter);
app.use(postRouter);
// ************ END ROUTE REGISTRATION ********** //
  
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('Not found');
	error.status = 404;
	next(error);
});

// error handler
app.use((error, req, res, next) => {

  // next();
  if (error.status === 404) {
    console.log(error);
    res.status(404).render('pages/error404');
  }
  else {
    console.log(error);
    res.status(500).render('pages/error500');
  }

});


module.exports = app;