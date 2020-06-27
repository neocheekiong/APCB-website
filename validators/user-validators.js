const repositories = require('../repositories');

const VALIDATION_ERROR_MESSAGES = {
    EMAIL_EXISTS: 'Email exists',
    NOT_AN_EMAIL: 'Your email entry is of the wrong format',
    PASSWORD_NOT_SECURE: `Your password does not meet our standard. Select a password with the following: 
- Minimum 10 Characters
- 1 Uppercase Alphabet
- 1 Lowercase Alphabet
- 1 Number
- 1 Special Character from @, $, !, %, *, ? and &`
};

const VALIDATION_REGEXP = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/
};

function regExpValidation (string) {
    return function (type) {
        return VALIDATION_REGEXP[type].test(string);
    };
}

async function doesEmailExist (email) {
    let result = await repositories.find({
        email: email
    })('users');
    return !!result;
}

async function validateNewUser (data) {
    try {
        if (await doesEmailExist(data.email)) {
            throw new Error(VALIDATION_ERROR_MESSAGES.EMAIL_EXISTS);
        }

        if (await regExpValidation(data.email)('EMAIL') === false) {
            throw new Error(VALIDATION_ERROR_MESSAGES.NOT_AN_EMAIL);
        }

        if (await regExpValidation(data.password)('PASSWORD') === false) {
            throw new Error(VALIDATION_ERROR_MESSAGES.PASSWORD_NOT_SECURE);
        }
        return true;
    } catch (error) {
        return error;
    }

}
module.exports = {
    regExpValidation,
    doesEmailExist,
    validateNewUser
};
