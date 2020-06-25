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
    api_secret: 'G9q1hPY9Iq7FCo83lNv49Ke1eb4'
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
        return (request, response) => {
            console.log('renderPage session data:', request.session.currentUser);
            response.render(page, request.session.currentUser);
        };
    },

    async renderEducationPage (request, response) {
        let user = await repositories.user.find({
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
            let result = await repositories.user.insertUser({
                email: data.email,
                password: data.password,
                createdAt: new Date()
            });
            const newUserID = result.insertedId;
            const user = await repositories.user.find({
                _id: new ObjectID(newUserID)
            })('users');
            request.session.currentUser = user;
            console.log('processRegistration session data:', request.session.currentUser);
            response.redirect(`/personal/${user._id}`);
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

    async updateEducation (request, response) {
        let documentation = request.files;
        let education = request.body.education;
        for (const index in documentation) {
            if (documentation.hasOwnProperty(index)) {
                const document = documentation[index];
                try {
                    let result = await cloudinary.uploader.upload(document.path, {
                        public_id: `uploads/${request.params.userid}/${document.originalname}`
                    });
                    console.log('cloudinary upload result', index, result);
                    education[index].documentation = result.url;
                } catch (err) {
                    console.log(err);
                }
            }
        }
        console.log('education', education);
        repositories.user.update(request.params.userid)({ education: education });
        response.redirect('/');
    }
};
