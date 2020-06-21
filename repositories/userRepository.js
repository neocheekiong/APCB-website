const db = require('../db');

module.exports = {
    async insertUser (data) {
        let result = await db.users.insertOne(data);
        return result;
    },

    find (data) {
        return async function (collection) {
            return await db[collection].findOne(data);
        };
    } 
};
