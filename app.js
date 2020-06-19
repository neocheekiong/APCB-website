/**
 * Configuring App
 */
const express = require('express');
const app = express();
const port = process.env.port || 3000;
app.set('view engine', 'ejs');

/**
 * Middleware
 */
const session = require('express-session');
const methodOverride = require('method-override');

const db = require('./db');
const routes = require('./routes');

routes(app);

app.listen(port, () => {
    db.connect();
    console.log('Listening on port', port);
});



