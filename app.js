require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const passport   = require('passport');
const session    = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const app = express();

// Handlebars
app.engine('handlebars', exphbs(
  { 
    defaultLayout: 'main' ,
    helpers: {
        copyrightYear: function() {
            return new Date().getFullYear();
        }
    }
  }
));
app.set('view engine', 'handlebars');

// handle back button when logout
app.use(function (req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

//flash message
app.use(flash());
// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride((req, res)=>{
    if (req.body && typeof req.body == 'object' && '_method' in req.body) 
     { 
         // look in urlencoded POST bodies and delete it
         var method = req.body._method;
         delete req.body._method;
         return method;
       } 
     }));
app.use(bodyParser.json());

// For Passport
 
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
 
app.use(passport.initialize());
 
app.use(passport.session()); // persistent login sessions

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Index route
app.get('/', (req, res) => res.render('login', { layout: 'login',error: req.flash('error') }));
app.use('/auth',require('./routes/auth'));

//middleware for auth router below this line
const authLogin = require('./middlewares/auth');
app.use(authLogin);
// Users routes
app.use('/users', require('./routes/users'));

require('./config/passport')(passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  res.render('404', {layout: "error"});
});


const PORT = process.env.APP_PORT;

app.listen(PORT, console.log(`Server started on port ${PORT}`));