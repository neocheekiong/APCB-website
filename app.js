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
const MongoDBStore = require('connect-mongodb-session')(session);
const methodOverride = require('method-override');

app.use(methodOverride('_method'));

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: 'sessions'
});

store.on('error', error => {
    console.log(error);
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}));

const db = require('./db');
const routes = require('./routes');

routes(app);

app.listen(PORT, () => {
    db.connect();
    console.log('Listening on port', PORT);
});
