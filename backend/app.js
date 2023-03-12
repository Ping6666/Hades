var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

var api_auth_router = require('./routes/api_auth');
var api_db_op_router = require('./routes/api_db_op');

const SESSION_SECRET = process.env.SESSION_SECRET;

var app = express();

/*
  cors: using nginx to fix this problem
*/
// var cors = require('cors');
// const cors_options = {
//   origin: [
//     'http://localhost:8080',
//     'http://127.0.0.1:8080',
//   ],
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };
// app.use(cors(cors_options));
// app.use(cors());

/*
  cookie
*/
// app.use(cookieParser());
app.use(
  session({
    name: 'hades',
    secret: SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: 'strict', // true
      secure: false, // true
      maxAge: 1 * 60 * 60 * 1000, // 1 hr in milliseconds
    },
  })
);

app.all('*', function (req, res, next) {
  console.log(req.session);
  console.log(req.sessionID);

  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', api_auth_router);
app.use('/api/db/op', api_db_op_router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
