const controllers = require('../controllers/index');
const views = require('../views');
const upload = require('multer')({
    dest: './uploads/'
});

module.exports = (app) => {
    app.get('/', controllers.renderUserInfoPage(views.INDEX_PAGE));
    app.get('/register', controllers.renderUserInfoPage(views.REGISTRATION_PAGE));
    app.post('/register', controllers.processRegistration);
    app.get('/login', controllers.renderUserInfoPage(views.LOGIN_PAGE));
    app.post('/login', controllers.login);
    app.get('/logout', controllers.logout);
    app.get('/personal/:userid', controllers.renderUserInfoPage(views.PERSONAL_INFO_PAGE));
    app.post('/personal/:userid', controllers.updatePersonal);
    app.get('/education/:userid', controllers.renderUserInfoPage(views.EDUCATION_PAGE));
    app.post('/education/:userid', upload.array('documentation'), controllers.updateDocumentedField('education'));
    app.get('/experience/:userid', controllers.renderUserInfoPage(views.EXPERIENCE_PAGE));
    app.post('/experience/:userid', upload.array('documentation'), controllers.updateDocumentedField('experience'));
    app.get('/training/:userid', controllers.renderUserInfoPage(views.TRAINING_PAGE));
    app.post('/training/:userid', upload.array('documentation'), controllers.updateDocumentedField('training'));
    app.get('/supervision/:userid', controllers.renderUserInfoPage(views.SUPERVISION_PAGE));
    app.post('/supervision/:userid', upload.array('documentation'), controllers.updateDocumentedField('supervision'));
    app.get('/assess/:userid', controllers.renderUserInfoPage(views.ASSESSMENT_CONFIRMATION_PAGE));
    app.post('/assess/:userid', controllers.submitApplication);
    app.get('/renewal/:userid', controllers.renderUserInfoPage(views.ASSESSMENT_CONFIRMATION_PAGE));
    app.post('/renewal/:userid', controllers.submitApplication);
    app.get('/memberdashboard/:userid', controllers.renderUserInfoPage(views.MEMBER_DASHBOARD_PAGE));
    app.get('/registrardashboard/:userid', controllers.renderRegistrarDashboard);
    app.get('/view/:userid', controllers.renderViewPage);
    app.put('/approve/:userid', controllers.approveRequest); // TODO
};
