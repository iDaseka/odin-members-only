require('dotenv').config();
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const hubRouter = require('./routes/hub');

const User = require('./models/user');

mongoose.set('strictQuery', false);
main().catch((err) => console.log(err));
async function main(){
  await mongoose.connect(process.env.MONGODB_URL);
}

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50
});

const app = express();

app.use(session({
  secret: "cats",
  resave: false,
  saveUninitialized: true
}))
app.use(passport.session());
passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, (async (username, password, done) => {
  try {
    const user = await User.findOne({email: username});
    if (!user){
      return done(null, false, {message: 'Incorrect username'});
    }
    console.log(user);
    const match = await bcrypt.compare(password, user.password);
    console.log(match);
    if (!match){
      return done(null, false, {message: 'Incorrect password'});
    }
    return done(null, user);
  }catch(err){
    return done(err);
  }
})));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  }catch(err){
    done(err);
  }
})
app.use(flash());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression());
app.use(helmet.contentSecurityPolicy({
  directives: {
    "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"]
  }
}));
app.use(limiter);
app.use(express.urlencoded({extended: false}));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/hub', hubRouter);

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
