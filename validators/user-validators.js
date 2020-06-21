const { find } = require('../repositories/userRepository');

const validationRegExp = {
    email: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/
};

module.exports = {
    regExpValidation (string) { return function (type) {
        return validationRegExp[type].test(string);
    };},

    async isEmailUnique (email) { 
        let result = await find({ email: email })('users');
        console.log(result);
        return !result; 
    }
};
