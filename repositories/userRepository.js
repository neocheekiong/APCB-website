const db = require('../db');

module.exports = {
    async insertUser(data) {
        let result = await db.users.insertOne(data);
        return result;
    },

    find: async (data) => (collection) => {
        let result = await db[collection].findOne(data);
        return result;
    }
};
