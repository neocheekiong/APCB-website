const controllers = require('../controllers/index');
const views = require('../views');
const upload = require('multer')({
    dest: './uploads/'
});

module.exports = (app) => {
    app.get('/', controllers.renderInfoPage(views.INDEX_PAGE));
    app.get('/register', controllers.renderInfoPage(views.REGISTRATION_PAGE));
    app.post('/register', controllers.processRegistration);
    app.get('/login', controllers.renderInfoPage(views.LOGIN_PAGE));
    app.get('/personal/:userid', controllers.renderInfoPage(views.PERSONAL_INFO_PAGE));
    app.post('/personal/:userid', controllers.updatePersonal);
    app.get('/education/:userid', controllers.renderInfoPage(views.EDUCATION_PAGE));
    app.post('/education/:userid', upload.array('documentation'), controllers.updateDocumentedField('education'));
    app.get('/experience/:userid', controllers.renderInfoPage(views.EXPERIENCE_PAGE));
    app.post('/experience/:userid', controllers.updateDocumentedField('experience'));
    app.get('/dashboard/:userid', controllers.renderInfoPage(views.DASHBOARD_PAGE));
};
