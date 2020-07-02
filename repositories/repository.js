const db = require('../db');
const {
    ObjectID
} = require('mongodb');

module.exports = {
    insert: (data) => async (collection) => {
        let result = await db[collection].insertOne(data);
        return result;
    },

    findOne: (data) => async (collection) => {
        return await db[collection].findOne(data);
    },

    update: (objectID) => (data) => async (collection) => {
        try {
            let result = await db[collection].updateOne({
                _id: new ObjectID(objectID)
            }, {
                $set: data
            });
            console.log('Update Result:', result);
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    findAll: (data) => async (collection) => {
        try {
            const result = await db[collection].find(
                data
            ).toArray();
            console.log('Collection:', collection, 'data:', data, result);
            return result;
        } catch (error) {
            console.log(error.message);
        }
    }
};
