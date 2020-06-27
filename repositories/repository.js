const db = require('../db');
const {
    ObjectID
} = require('mongodb');

module.exports = {
    insert: (data) => async (collection) => {
        let result = await db[collection].insertOne(data);
        return result;
    },

    find: (data) => async (collection) => {
        return await db[collection].findOne(data);
    },

    update: (objectID) => (data) => async (collection) => {
        try {
            let result = await db[collection].updateOne({
                _id: new ObjectID(objectID)
            }, {
                $set: data
            });
            // console.log('Update Result:', result);
            return result;
        } catch (error) {
            console.log(error);
        }
    }
};
