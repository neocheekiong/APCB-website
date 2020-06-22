const controllers = require('../controllers/index');
const views = require('../views');

module.exports = (app) => {
    let user;
    app.use((request, response, next) => {
        if(request.session.currentUser) {
            user = request.session.currentUser;
        }
    });
    app.get('/', controllers.renderPage(views.INDEX_PAGE)({ user }));
    app.get('/register', controllers.renderPage(views.REGISTRATION_PAGE)());
    app.post('/register', controllers.processRegistration);
    app.post('/validation/:type', controllers.validateString);
    app.get('/education/:userid', controllers.renderPage(views.EDUCATION_PAGE)({ user }));
};
