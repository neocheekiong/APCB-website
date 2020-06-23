const views = require('../views');
const repositories = require('../repositories');
const bcrypt = require('bcrypt');
const { ObjectID } = require('mongodb');
const validators = require('../validators');
const { validateNewUser } = require('../validators/user-validators');
const { find } = require('../repositories/userRepository');

const SALT_ROUNDS = 10;
module.exports = {
    /**
     * Renders specified page
     */
    renderPage: page => ( data = {}) => {
        return (request, response) => {
            console.log('renderPage session data:', request.session.currentUser);
            console.log('data:', data);
            response.render(page, data);
        };
    },

    async renderEducationPage (request, response) {
        let user = await find({ _id: new ObjectID(request.params.userid) })('users');
        response.render(views.EDUCATION_PAGE, { user });
    },

    async processRegistration (request, response) {
        console.log('Processing Registration');
        const data = request.body;
        try {
            let validation = await validateNewUser(data);
            if(validation !== true) {
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
            response.redirect(`/education/${user._id}`);
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
        return validators.user.regExpValidation(data)(type);
    }
};
