/**
 * Configuring App
 */
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));

/**
 * Middleware
 */
const session = require('express-session');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
const sessionSecret = process.env.SESSION_SECRET || 'sekrit';
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false
}));
const db = require('./db');
const routes = require('./routes');

routes(app);
app.post('/education' );
app.listen(PORT, () => {
    db.connect();
    console.log('Listening on port', PORT);
});



