const db = require('../db');

module.exports = {
    async insertUser (data) {
        let result = await db.users.insertOne(data);
        return result;
    },

    async find (data) {
        let result = await db.users.findOne(data);
        return result;
    }
};
