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
    renderUserInfoPage: page => {
        return async (request, response) => {
            const sessionUser = request.session.currentUser;
            const userData = await repositories.findOne({
                _id: new ObjectID(sessionUser)
            })('users');
            console.log('renderPage session data:', sessionUser);
            console.log('userdata', userData);
            if (typeof request.params.userid !== 'undefined')
                authorizationRequired(['members', 'admin'])(true)(sessionUser)(userData) || response.render(views.ERROR_PAGE, { message: 'You\'re not allowed to view this page!' });
            response.render(page, { currentUser: userData });
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
            response.redirect(`/personal/${newUserID}`);
        } catch (error) {
            console.log('ERROR:', error);
            response.render(views.ERROR_PAGE, {
                message: error
            });
        }
    },

    validateString (request, response) {
        const type = request.params.type;
        const data = request.body[type];
        response.send(validators.user.regExpValidation(data)(type));
    },

    async updatePersonal (request, response) {
        const pageUser = request.params.userid;
        const sessionUser = request.session.currentUser;
        const userData = await repositories.findOne({
            _id: new ObjectID(pageUser)
        })('users');
        authorizationRequired(['members', 'admin'])(true)(sessionUser)(userData) || response.render(views.ERROR_PAGE, { message: 'You are not allowed here!' });
        await repositories.update(pageUser)(request.body)('users');
        response.redirect(`/education/${sessionUser}`);
    },

    updateDocumentedField: (type) => async (request, response) => {
        const userid = request.params.userid;
        const sessionUser = request.session.currentUser;
        let documentation = request.files;
        console.log('Request Body:', request, 'Type:', type);
        let data = request.body[type];
        console.log('Form Data:', data);
        const userData = await repositories.findOne({
            _id: new ObjectID(sessionUser)
        })('users');

        authorizationRequired(['members', 'admin'])(true)(sessionUser)(userData) || response.render(views.ERROR_PAGE, { message: 'You are not allowed here!' });

        for (const index in documentation) {
            const document = documentation[index];
            try {
                let result = await cloudinary.uploader.upload(document.path, {
                    folder: `uploads/${userid}`,
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
        repositories.update(userid)(updateField)('users');
        response.redirect(`/memberdashboard/${userid}`);
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
            response.redirect(`/${user.role}dashboard/${userid}`);
        } catch (error) {
            console.error(error.message);
            response.render(views.ERROR_PAGE, {
                message: 'Wrong Username or Password'
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
        const userData = await repositories.findOne({
            _id: new ObjectID(request.session.currentUser)
        })('users');
        repositories.insert({
            _userID: new ObjectID(userID),
            candidateName: userData.name,
            requestDate: new Date(),
            status: 'pending',
            type: 'new applicant'
        })('approvals');
        // TODO Send Email
        response.redirect(`memberdashboard/${userID}`);
    },

    async renderRegistrarDashboard (request, response) {
        const registrarID = request.params.userid;
        const sessionUser = request.session.currentUser;
        const userData = await repositories.findOne({
            _id: new ObjectID(registrarID)
        })('users');

        authorizationRequired(['registrar', 'admin'])(true)(sessionUser)(userData) || response.render(views.ERROR_PAGE, { message: 'You are not allowed here!' });

        const approvalRequests = await repositories.findAll({
            status: 'pending'
        })('users');

        console.log(userData);
        response.render(views.REGISTRAR_DASHBOARD, {
            currentUser: userData,
            requests: approvalRequests
        });
    },

    async renderViewPage (request, response) {
        
        const userID = request.params.userid;
        const sessionUser = request.session.currentUser;
        const userData = await repositories.findOne({
            _id: new ObjectID(userID)
        })('users');

        const loggedInUser = await repositories.findOne({
            _id: new ObjectID(sessionUser)
        })('users');

        authorizationRequired(['registrar', 'admin'])(true)(sessionUser)(userData) || response.render(views.ERROR_PAGE, { message: 'You are not allowed here!' });

        response.render(views.VIEW_PROFILE, {
            currentUser: loggedInUser,
            candidate: userData
        });
    },

    async approveRequest (request, response) {
        allowRegistrarAndAdmin();

        let approvalRequest = request.params.userid;
        let today = new Date().getVarDate();
        let expiryDate = new Date(today.getFullYear + 3, today.getMonth, today.getDay);
        let config = await repositories.findOne({})('config');
        repositories.update(approvalRequest)({
            $set: {
                status: 'approved',
                approvalDate: today,
                expiryDate: expiryDate,
                certificateLevel: request.body.certificateLevel,
                certificateNumber: `SA${today.getFullYear}${config.lastCertificateNumber}SG`,
            }
        })('users');
        response.redirect(`/registrardashboard/${request.session.currentUser}`);
    }
};

/**
 * Denies access to users who are not the owner of the profile
 * Admin can view
 */
function denyNonOwnerNonAdmin (request, response, user) {
    if (request.params.userid && request.params.userid !== request.session.currentUser && (user.role !== 'admin')) {
        console.log('Thou shalt not pass!');
        response.render(views.ERROR_PAGE, {
            message: 'You\'re not supposed to peek at others!'
        });
    }
}

function allowRegistrarAndAdmin (request, response, user) {
    if ((user.role !== 'admin') || (user.role !== 'registrar')) {
        console.log('Thou shalt not pass!');
        response.render(views.ERROR_PAGE, {
            message: 'You\'re not supposed to peek at this!'
        });
    }
}

/**
 * 
 * @param {array} allowedRoles array of allowed roles
 * 
 */
const authorizationRequired = allowedRoles => requireOwnership => sessionData => userData => {
    const userRoleAllowed = allowedRoles.includes(userData.role);
    if (requireOwnership) {
        return userData.role === 'admin' || sessionData === userData.id && userRoleAllowed;
    }
    return userRoleAllowed;
};
