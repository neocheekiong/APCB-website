/**
 * Configuring App
 */
const express = require('express');
const app = express();
const port = process.env.port || 3000;
app.set('view engine', 'ejs');
app.use(express.static('static'));

/**
 * Middleware
 */
const session = require('express-session');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
const sessionSecret = process.env.SECRET || 'MySecret';
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false
}));
const db = require('./db');
const routes = require('./routes');

routes(app);

app.listen(port, () => {
    db.connect();
    console.log('Listening on port', port);
});



