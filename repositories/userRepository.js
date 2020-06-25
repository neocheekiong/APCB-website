const db = require('../db');
const {
    ObjectID
} = require('mongodb');

module.exports = {
    async insertUser (data) {
        let result = await db.users.insertOne(data);
        return result;
    },

    find (data) {
        return async function (collection) {
            return await db[collection].findOne(data);
        };
    },

    update: (userID) => async (data) => {
        try {
            let result = await db.users.updateOne({
                _id: new ObjectID(userID)
            }, {
                $set: data
            });
            console.log('Update Result:', result);
            return result;
        } catch (error) {
            console.log(error);
        }
    }
};
