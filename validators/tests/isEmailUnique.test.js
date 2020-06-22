const {
    expect
} = require('chai');
const validators = require('../index');
const db = require('../../db');

describe('Email Checking', () => {
    beforeAll(async () => {
        await db.connect();
    });

    afterAll(async () => {
        await db.disconnect();
    });
    it('should return true if the email does not exist in DB', async () => {
        const address = 'neocheekiong@gmail.com';
        let result = await validators.user.doesEmailExist(address);
        expect(result).to.be.false;
    });

    it('should return false if the email exists in the DB', async () => {
        const address = 'cheekiong@promises.com.sg';
        let result = await validators.user.doesEmailExist(address);
        expect(result).to.be.true;
    });
});
