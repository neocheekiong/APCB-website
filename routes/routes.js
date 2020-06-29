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
    app.post('/login', controllers.login);
    app.get('/personal/:userid', controllers.renderInfoPage(views.PERSONAL_INFO_PAGE));
    app.post('/personal/:userid', controllers.updatePersonal);
    app.get('/education/:userid', controllers.renderInfoPage(views.EDUCATION_PAGE));
    app.post('/education/:userid', upload.array('documentation'), controllers.updateDocumentedField('education'));
    app.get('/experience/:userid', controllers.renderInfoPage(views.EXPERIENCE_PAGE));
    app.post('/experience/:userid', upload.array('documentation'), controllers.updateDocumentedField('experience'));
    app.get('/training/:userid', controllers.renderInfoPage(views.TRAINING_PAGE));
    app.post('/training/:userid', upload.array('documentation'), controllers.updateDocumentedField('training'));
    app.get('/supervision/:userid', controllers.renderInfoPage(views.SUPERVISION_PAGE));
    app.post('/supervision/:userid', upload.array('documentation'), controllers.updateDocumentedField('supervision'));
    app.get('/assess/:userid', controllers.renderInfoPage(views.ASSESSMENT_CONFIRMATION_PAGE));
    app.post('/assess/:userid', controllers.submitApplication);
    app.get('/renewal/:userid', controllers.renderInfoPage(views.ASSESSMENT_CONFIRMATION_PAGE));
    app.post('/renewal/:userid', controllers.submitApplication);
    app.get('/memberdashboard/:userid', controllers.renderInfoPage(views.MEMBER_DASHBOARD_PAGE));
    app.get('/registrardashboard/:userid', controllers.renderRegistrarDashboard(views.REGISTRAR_DASHBOARD));
    app.get('/view/:userid', controllers.renderViewPage(views.VIEW_PROFILE));
    app.put('/approve/:requestid', controllers.approveRequest); // TODO
};
