const views = require('../views');
const repositories = require('../repositories');
const bcrypt = require('bcrypt');
const { ObjectID } = require('mongodb');
const validators = require('../validators');

const SALT_ROUNDS = 10;
module.exports = {
    /**
     * Renders specified page
     */
    renderPage: page => (data = {}) => {
        return (request, response) => {
            response.render(page, data);
        };
    },

    async processRegistration (request, response) {
        console.log('Processing Registration');
        const data = request.body;
        try {
            data.password = bcrypt.hashSync(data.password, SALT_ROUNDS);
            let result = await repositories.user.insertUser({
                email: data.email,
                password: data.password
            });
            const newUserID = result.insertedId;
            const user = await repositories.user.find({
                _id: new ObjectID(newUserID)
            });
            request.session.currentUser = user;
            response.redirect('/');
        } catch (error) {
            console.log(error);
            response.render(views.ERROR_PAGE, {
                message: error.message
            });
        }
    },

    validateString (request, response) {
        const type = request.params.type;
        const data = request.body[type];
        return validators.user.regExpValidation(data)(type);
    }
};
