const controllers = require('../controllers/index');
const views = require('../views');

module.exports = (app) => {
    let user;
    app.use((request, response, next) => {
        if(request.session.currentUser) {
            user = request.session.currentUser;
        }
        next();
    });
    app.get('/', controllers.renderPage(views.INDEX_PAGE)({ user }));
    app.get('/register', controllers.renderPage(views.REGISTRATION_PAGE)());
    app.post('/register', controllers.processRegistration);
    app.get('/personal/:userid', controllers.renderPage(views.PERSONAL_INFO_PAGE)({ user }));
    app.post('/personal/:userid', controllers.updateInfo({ user }));
    app.get('/education/:userid', controllers.renderPage(views.EDUCATION_PAGE)({ user }));
    app.post('/education/:userid', controllers.renderPage(views.EDUCATION_PAGE)({ user }));
};
