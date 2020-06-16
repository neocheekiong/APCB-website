const controllers = require('..controllers/');
/**
 * Page Views
 */
const INDEX_PAGE = 'index.ejs';
const REGISTRATION_PAGE = 'registration.ejs';
    
module.exports = (app) => {
    
    app.get('/', controllers.renderPage(INDEX_PAGE));
    app.get('/register', controllers.renderPage(REGISTRATION_PAGE));
};
