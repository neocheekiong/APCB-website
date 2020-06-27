const MongoClient = require('mongodb').MongoClient;

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = 'apcb';
const COLLECTIONS = {
    USERS: 'users'
};

const client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });

module.exports = {
    async connect () {
        const connection = await client.connect();
        console.log('Connected to MongoDB');
        const db = connection.db(DB_NAME);
        this.users = db.collection(COLLECTIONS.USERS);
    },
    disconnect () {
        return client.close();
    },
};
