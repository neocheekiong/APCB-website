const controllers = require('../controllers/index');
const views = require('../views');

module.exports = (app) => {
    let user;
    app.use((request, response, next) => {
        if(request.session.currentUser) {
            user = request.session.currentUser;
            console.log('middleware user' ,user);
        }
        next();
    });
    app.get('/', controllers.renderInfoPage(views.INDEX_PAGE));
    app.get('/register', controllers.renderInfoPage(views.REGISTRATION_PAGE));
    app.post('/register', controllers.processRegistration);
    app.get('/personal/:userid', controllers.renderInfoPage(views.PERSONAL_INFO_PAGE));
    app.post('/personal/:userid', controllers.updatePersonal);
    app.get('/education/:userid', controllers.renderInfoPage(views.EDUCATION_PAGE));
    // app.post('/education/:userid', (request, response) => {
    //     console.log('post', request.body);
    // });
};
