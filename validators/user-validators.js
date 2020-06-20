const validationRegExp = {
    email: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/
};

module.exports = {
    isStringValid: (string) => (type) => {
        return validationRegExp[type].test(string);
    },
};
