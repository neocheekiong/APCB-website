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
    renderInfoPage: page => {
        return async (request, response) => {

            console.log('renderPage session data:', request.session.currentUser);
            const userdata = await repositories.find({
                _id: new ObjectID(request.session.currentUser)
            })('users');

            checkAuthorisation(request, response, userdata);
            // console.log(userdata);
            response.render(page, userdata);
        };
    },

    async renderEducationPage (request, response) {
        let user = await repositories.find({
            _id: new ObjectID(request.params.userid)
        })('users');
        response.render(views.EDUCATION_PAGE, {
            user
        });
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
                createdAt: new Date()
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
        const userID = request.params.userid;
        await repositories.update(userID)(request.body)('users');
        response.redirect(`/education/${userID}`);
    },

    updateDocumentedField: (type) => async (request, response) => {
        const userid = request.params.userid;
        let documentation = request.files;
        console.log('Request Body:', request, 'Type:', type);
        let data = request.body[type];
        console.log('Form Data:', data);
        checkAuthorisation (request, response);
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
        repositories.user.update(userid)(updateField)('users');
        response.redirect(`/memberdashboard/${userid}`);
    },

    async login (request, response) {
        const userEmail = request.body.email;
        const submittedPassword = request.body.password;
        try {
            let user = await repositories.find({
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
            response.render('error.ejs', {
                message: 'Wrong Username or Password'
            });
        }
    },

    logout (request, response) {
        return request.session.destroy(() => {
            response.redirect('/');
        });
    },

    assessIndividual (request, response) {
        const userID = request.params.userid;
        repositories.insert({
            _userID: new ObjectID(userID),
            requestDate: new Date(),
            status: 'pending'
        });
        // TODO Send Email
        response.redirect(`membersdashboard/${userID}`);
    }
};
function checkAuthorisation (request, response, user) {
    console.log('Checking Authorisation...', 'Request Params:', request.params, 'REQUEST SESSION:', request.session);
    console.log('request.params.userid !== request.session.currentUser',request.params.userid !== request.session.currentUser);

    if (request.params.userid && request.params.userid !== request.session.currentUser && user.role === 'member') {
        console.log('did test pass?');
        response.render(views.ERROR_PAGE, { message: 'You\'re not supposed to peek at others!' });
    }
}

