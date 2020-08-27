if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = require('express')();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');

// Passport Config
require('./config/passport')(passport);

mongoose.connect(process.env.MONGODB_NAV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const db = mongoose.connection;

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Override
app.use(methodOverride('_method'));

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//Routes


//On error [MongoDB]
db.on('error', (error) => console.log(error));
//On open [MongoDB]
db.once('open', () => console.log('Connected to database'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

app.get('*', (req, res) => {
    res.status(404).send('Cannot find page');
});