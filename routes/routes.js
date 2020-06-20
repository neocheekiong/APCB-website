const controllers = require('../controllers/index');
const views = require('../views');

module.exports = (app) => {
    app.get('/', controllers.renderPage(views.INDEX_PAGE)());
    app.get('/register', controllers.renderPage(views.REGISTRATION_PAGE)());
    app.post('/register', controllers.processRegistration);
};
