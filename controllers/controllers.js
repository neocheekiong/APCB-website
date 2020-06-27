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
        return (request, response) => {
            console.log('renderPage session data:', request.session.currentUser);
            const userdata = repositories.user.findUser({
                _id: new ObjectID(request.session.currentUser)
            }).then(
                () => {
                    console.log(userdata);
                    response.render(page, userdata);
                }
            );
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
        let data = request.body[type];
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
        console.log('education', data);
        const updateField = {};
        updateField[type] = data;
        repositories.user.update(userid)(updateField);
        response.redirect(`/dashboard/${userid}`);
    },
};
