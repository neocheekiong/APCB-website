const views = require('../views');
const repositories = require('../repositories');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;
module.exports = {
    /**
     * Renders specified page
     */
    renderPage: page => (data = {}) => {
        console.log('Trying to render Page');
        return (request, response) => {
            response.render(page, data);
        };
    },

    async processRegistration (request, response) {
        const data = request.body;
        try {
            data.password = await bcrypt.hash(data.password, bcrypt.genSalt(SALT_ROUNDS, err => err.message));
            repositories.user.insertUser(data);
        } catch (error) {
            response.render(views.ERROR_PAGE, { message: error.message });
        }
    }
};
