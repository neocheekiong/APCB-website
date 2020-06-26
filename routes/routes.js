const controllers = require('../controllers/index');
const views = require('../views');
const upload = require('multer')({
    dest: './uploads/'
});

module.exports = (app) => {
    app.get('/', controllers.renderInfoPage(views.INDEX_PAGE));
    app.get('/register', controllers.renderInfoPage(views.REGISTRATION_PAGE));
    app.post('/register', controllers.processRegistration);
    app.use((request, response, next) => {
        if(typeof request.session.currentUser != undefined && request.session.currentUser === request.params.userid) {
            next();
        } else {
            response.render(views.ERROR_PAGE, { message: '401 - Forbidden' });
        }
    });
    app.get('/personal/:userid', controllers.renderInfoPage(views.PERSONAL_INFO_PAGE));
    app.post('/personal/:userid', controllers.updatePersonal);
    app.get('/education/:userid', controllers.renderInfoPage(views.EDUCATION_PAGE));
    app.post('/education/:userid', upload.array('documentation'), controllers.updateEducation);
    app.get('/experience/:userid', controllers.renderInfoPage(views.EXPERIENCE_PAGE));
    app.post('/experience/:userid', controllers.updateExperience);
    app.get('/dashboard/:userid', controllers.renderInfoPage(views.DASHBOARD_PAGE));
};
