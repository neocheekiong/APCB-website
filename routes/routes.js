const controllers = require('../controllers/index');
const views = require('../views');
const upload = require('multer')({
    dest: './uploads/'
});
const PERMISSIONS = {
    PUBLIC: ['public'],
    MEMBERS_ONLY: ['member'],
    REGISTRAR_ONLY: ['registrar']
};

module.exports = (app) => {
    app.get('/', controllers.renderMemberInfoPage(views.INDEX_PAGE)(PERMISSIONS.PUBLIC));
    app.get('/register', controllers.renderMemberInfoPage(views.REGISTRATION_PAGE)());
    app.post('/register', controllers.processRegistration);
    app.get('/login', controllers.renderMemberInfoPage(views.LOGIN_PAGE)(PERMISSIONS.PUBLIC));
    app.post('/login', controllers.login);
    app.get('/logout', controllers.logout);
    app.get('/personal', controllers.renderMemberInfoPage(views.PERSONAL_INFO_PAGE)(PERMISSIONS.MEMBERS_ONLY));
    app.post('/personal/:userid', controllers.updatePersonal);
    app.get('/education', controllers.renderMemberInfoPage(views.EDUCATION_PAGE)(PERMISSIONS.MEMBERS_ONLY));
    app.post('/education/:userid', upload.array('documentation'), controllers.updateDocumentedField('education'));
    app.get('/experience', controllers.renderMemberInfoPage(views.EXPERIENCE_PAGE)(PERMISSIONS.MEMBERS_ONLY));
    app.post('/experience/:userid', upload.array('documentation'), controllers.updateDocumentedField('experience'));
    app.get('/training', controllers.renderMemberInfoPage(views.TRAINING_PAGE)(PERMISSIONS.MEMBERS_ONLY));
    app.post('/training/:userid', upload.array('documentation'), controllers.updateDocumentedField('training'));
    app.get('/supervision', controllers.renderMemberInfoPage(views.SUPERVISION_PAGE)(PERMISSIONS.MEMBERS_ONLY));
    app.post('/supervision/:userid', upload.array('documentation'), controllers.updateDocumentedField('supervision'));
    app.get('/assess', controllers.renderMemberInfoPage(views.ASSESSMENT_CONFIRMATION_PAGE)(PERMISSIONS.MEMBERS_ONLY));
    app.post('/assess/:userid', controllers.submitApplication);
    app.get('/renewal', controllers.renderMemberInfoPage(views.ASSESSMENT_CONFIRMATION_PAGE)(PERMISSIONS.MEMBERS_ONLY));
    app.post('/renewal/:userid', controllers.submitApplication);
    app.get('/memberdashboard', controllers.renderMemberInfoPage(views.MEMBER_DASHBOARD_PAGE)(PERMISSIONS.MEMBERS_ONLY));
    app.get('/registrardashboard', controllers.renderRegistrarDashboard);
    app.get('/view/:userid', controllers.renderViewPage);
    app.patch('/approve/:userid', controllers.approveRequest);
    app.patch('/deny/:userid', controllers.approveRequest);
};
