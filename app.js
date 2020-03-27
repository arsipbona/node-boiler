require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const passport   = require('passport')
const session    = require('express-session')
const flash = require('connect-flash');

const app = express();

//flash message
app.use(flash());

// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// For Passport
 
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
 
app.use(passport.initialize());
 
app.use(passport.session()); // persistent login sessions

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Index route
app.get('/', (req, res) => res.render('login', { layout: 'login',error: req.flash('error') }));
// Users routes
app.use('/users', require('./routes/users'));
app.use('/auth',require('./routes/auth'));

require('./config/passport')(passport);


const PORT = process.env.APP_PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));