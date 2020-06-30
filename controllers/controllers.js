const views = require('../views');
const repositories = require('../repositories');
const {
    ObjectID
} = require('mongodb');
const validators = require('../validators');

/**
 * Cloudinary Config
 */
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'apcb',
    api_key: '331716551633671',
    api_secret: process.env.CLOUDINARY_SECRET
});

/**
 * Encryption
 */
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
module.exports = {
    /**
     * Renders specified page
     */
    renderMemberInfoPage: page => (allowedRoles = ['public']) => {
        return async (request, response) => {
            const sessionUser = request.session.currentUser;
            const userData = await repositories.findOne({
                _id: new ObjectID(sessionUser)
            })('users');
            console.log('renderPage session data:', sessionUser, 'page ID');
            console.log('userdata', userData);

            authorizationRequired(allowedRoles)(userData) || response.render(views.ERROR_PAGE, {
                message: 'You\'re not allowed to view this page!',
                currentUser: userData
            });
            response.render(page, {
                currentUser: userData
            });
        };
    },

    async processRegistration (request, response) {
        console.log('Processing Registration');
        const data = request.body;
        try {
            let validation = await validators.user.validateNewUser(data);
            if (validation !== true) {
                console.log('VALIDATION:', validation);
                throw new Error(validation);
            }
            data.password = bcrypt.hashSync(data.password, SALT_ROUNDS);
            let result = await repositories.insert({
                email: data.email,
                password: data.password,
                role: 'member',
                createdAt: new Date(),
                education: [],
                training: [],
                supervision: [],
                experience: [],
                tests: [],
            })('users');
            const newUserID = result.insertedId;
            request.session.currentUser = newUserID;
            console.log('processRegistration session data:', request.session.currentUser);
            response.redirect('/personal');
        } catch (error) {
            console.log('ERROR:', error);
            response.render(views.ERROR_PAGE, {
                message: error,
                currentUser: null
            });
        }
    },

    validateString (request, response) {
        const type = request.params.type;
        const data = request.body[type];
        response.send(validators.user.regExpValidation(data)(type));
    },

    async updatePersonal (request, response) {
        const sessionUser = request.session.currentUser;
        const userData = await repositories.findOne({
            _id: new ObjectID(sessionUser)
        })('users');
        authorizationRequired(['member', 'admin'])(userData) || response.render(views.ERROR_PAGE, {
            message: 'You are not allowed here!',
            currentUser: userData
        });
        await repositories.update(sessionUser)(request.body)('users');
        response.redirect('/memberdashboard');
    },

    updateDocumentedField: (type) => async (request, response) => {
        const sessionUser = request.session.currentUser;
        let documentation = request.files;
        console.log('Request Body:', request, 'Type:', type);
        let data = request.body[type];
        console.log('Form Data:', data);
        const userData = await repositories.findOne({
            _id: new ObjectID(sessionUser)
        })('users');

        authorizationRequired(['member', 'admin'])(userData) || response.render(views.ERROR_PAGE, {
            message: 'You are not allowed here!',
            currentUser: userData
        });

        for (const index in documentation) {
            const document = documentation[index];
            try {
                let result = await cloudinary.uploader.upload(document.path, {
                    folder: `uploads/${sessionUser}`,
                    use_filename: true,
                    resource_type: 'auto'
                });
                console.log('cloudinary upload result', index, result);
                data[index].documentation = result.secure_url;
            } catch (err) {
                console.log(err);
            }
        }

        const updateField = {};
        updateField[type] = data;
        repositories.update(sessionUser)(updateField)('users');
        response.redirect('/memberdashboard');
    },

    async login (request, response) {
        const userEmail = request.body.email;
        const submittedPassword = request.body.password;
        try {
            let user = await repositories.findOne({
                email: userEmail
            })('users');
            if (!user) {
                throw new Error('404 User not found');
            }
            if (!bcrypt.compareSync(submittedPassword, user.password)) {
                throw new Error('Wrong Password');
            }
            const userid = user._id;
            request.session.currentUser = userid;
            response.redirect(`/${user.role}dashboard/`);
        } catch (error) {
            console.error(error.message);
            response.render(views.ERROR_PAGE, {
                message: 'Wrong Username or Password',
                currentUser: null
            });
        }
    },

    logout (request, response) {
        return request.session.destroy(() => {
            response.redirect('/');
        });
    },

    async submitApplication (request, response) {
        const userID = request.params.userid;
        console.log('submit userID', userID);
        await repositories.update(userID)({
            'status': 'pending'
        })('users');
        // TODO Send Email
        response.redirect('/memberdashboard');
    },

    async renderRegistrarDashboard (request, response) {
        const sessionUser = request.session.currentUser;
        const userData = await repositories.findOne({
            _id: new ObjectID(sessionUser)
        })('users');

        authorizationRequired(['registrar', 'admin'])(userData) || response.render(views.ERROR_PAGE, {
            message: 'You are not allowed here!',
            currentUser: userData
        });

        const approvalRequests = await repositories.findAll({
            'status': 'pending'
        })('users');
        console.log('approval Requests', approvalRequests);
        console.log(userData);
        response.render(views.REGISTRAR_DASHBOARD, {
            currentUser: userData,
            requests: approvalRequests
        });
    },

    async renderViewPage (request, response) {
        const viewTarget = request.params.userid;
        const sessionUser = request.session.currentUser;
        console.log('view Target',viewTarget);
        const userData = await repositories.findOne({
            _id: new ObjectID(viewTarget)
        })('users');

        const loggedInUser = await repositories.findOne({
            _id: new ObjectID(sessionUser)
        })('users');
        console.log('view Page logged in:', loggedInUser);
        authorizationRequired(['registrar'])(loggedInUser) || response.render(views.ERROR_PAGE, {
            message: 'You are not allowed here!',
            currentUser: userData
        });

        response.render(views.VIEW_PROFILE, {
            currentUser: loggedInUser,
            candidate: userData
        });
    },

    async approveRequest (request, response) {
        const sessionUser = request.session.currentUser;
        let approvalRequest = request.params.userid;
        const userData = await repositories.findOne({
            _id: new ObjectID(sessionUser)
        })('users');
        authorizationRequired(['registrar'])(userData);


        let today = new Date().getVarDate();
        let expiryDate = new Date(today.getFullYear + 3, today.getMonth, today.getDay);
        let config = await repositories.findOne({})('config');
        repositories.update(approvalRequest)({
            status: 'approved',
            approvalDate: today,
            expiryDate: expiryDate,
            certificateLevel: request.body.certificateLevel,
            certificateNumber: `SA${today.getFullYear}${config.lastCertificateNumber}SG`,
        })('users');
        response.redirect('/registrardashboard');
    }
};

/**
 * 
 * @param {array} allowedRoles array of allowed roles
 * 
 */
const authorizationRequired = allowedRoles => userData => {
    console.log('Auth function:',allowedRoles, userData);
    if (allowedRoles.includes('public')) {
        return true;
    } else if(userData) {
        const userRoleAllowed = allowedRoles.includes(userData.role);
        return userData.role === 'admin' || userRoleAllowed;
    }
    return false;
};
