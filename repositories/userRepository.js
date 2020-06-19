const db = require('../db');

module.exports = {
    async insertUser (data) {
        let result = await db.user.insertOne({ data });
        return result;
    },

    async find (data) {
        let result = await db.user.findOne(data);
        return result;
    }
};
