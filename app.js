/**
 * Configuring App
 */
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
app.set('view engine', 'ejs');
app.use(express.static('public'));

/**
 * Middleware
 */
const session = require('express-session');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const sessionSecret = process.env.SESSION_SECRET;
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false
}));
const db = require('./db');
const routes = require('./routes');

routes(app);
app.listen(PORT, () => {
    db.connect();
    console.log('Listening on port', PORT);
});
