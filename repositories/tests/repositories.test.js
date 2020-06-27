const { expect } = require('chai');
const repository = require('../index');
const db = require('../../db');

describe('Find Users', () => {
    beforeAll(async () => {
        await db.connect();
    });

    afterAll(async () => {
        await db.disconnect();
    });

    it('should return an empty object if email does not exist in database', async () => {
        const email = '123@xyz.com';
        let result = await repository.user.findUser({ email: email });
        expect(result).to.be.eql(null);
    });

    it('should return an object if email exists in the database', async () => {
        const email = 'abc@xyz.com';
        await repository.user.insertUser({ email });
        let result = await repository.user.findUser({ email: email });
        expect(result).to.be.an('object');
    });

    
});
