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
            const userdata = await repositories.user.findUser({
                _id: new ObjectID(request.session.currentUser)
            });
            // console.log(userdata);
            response.render(page, userdata);
        };
    },

    async renderEducationPage (request, response) {
        let user = await repositories.user.findUser({
            _id: new ObjectID(request.params.userid)
        });
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
            let result = await repositories.user.insertUser({
                email: data.email,
                password: data.password,
                role: 'Member',
                createdAt: new Date()
            });
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
        await repositories.user.update(userID)(request.body);
        response.redirect(`/education/${userID}`);
    },

    updateDocumentedField: (type) => async (request, response) => {
        const userid = request.params.userid;
        let documentation = request.files;
        console.log('Request Body:', request.body, 'Type:', type);
        let data = request.body[type];
        console.log('Form Data:', data);
        for (const index in documentation) {
            const document = documentation[index];
            try {
                let result = await cloudinary.uploader.upload(document.path, {
                    public_id: `uploads/${userid}/${document.originalname}`
                });
                console.log('cloudinary upload result', index, result);
                data[index].documentation = result.url;
            } catch (err) {
                console.log(err);
            }
        }
        
        const updateField = {};
        updateField[type] = data;
        repositories.user.update(userid)(updateField);
        response.redirect(`/memberdashboard/${userid}`);
    },

    async login (request, response) {
        const userEmail = request.body.email;
        const submittedPassword = request.body.password;
        try {
            let user = await repositories.user.findUser({
                email: userEmail
            });
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
        //TODO
    }
};
