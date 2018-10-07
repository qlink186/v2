var createError = require('http-errors');
var express = require('express');
var lessMiddleware = require('less-middleware');
var flash = require('express-flash');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var admRouter = require('./routes/adm');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'k0m1nf0',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: 15 * 60 * 10000
  }
}));

app.use(flash());
// Global Vars
app.use(function (req, res, next) {
  let base_url = 'http://' + req.headers.host + '/';
  let adm_url = base_url + 'admin/';
  let api_url = base_url + 'api/';
  res.locals.base_url = base_url;
  res.locals.module = '';
  res.locals.adm_url = adm_url;
  res.locals.api_url = api_url;

  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/adm', admRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
