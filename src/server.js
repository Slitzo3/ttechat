if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = require('express')();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const routine = require('./functions/dailyRoutine');

//remove this later albin lol
require('./functions/activationemail')();

// Passport Config
require('./config/passport')(passport);

mongoose.connect(process.env.MONGODB_NAV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

setInterval(() => {
  routine.NotActivatedRemover();
}, 86400000);

//Sockets
require('./socket/messages')(db);

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Override
app.use(methodOverride('_method'));

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/', require('./routes/index.js'));
app.use('/lobby', require('./routes/lobby.js'));

//On error [MongoDB]
db.on('error', (error) => console.log(error));
//On open [MongoDB]
db.once('open', () => console.log('Connected to database'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

app.get('*', (req, res) => {
  res.status(404).render('cannotFindPage');
});
