require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
// Handlebars

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Index route
app.get('/', (req, res) => res.render('login', { layout: 'login' }));

// Users routes
app.use('/users', require('./routes/users'));

const PORT = process.env.APP_PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));