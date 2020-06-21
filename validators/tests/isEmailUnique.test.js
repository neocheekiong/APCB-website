const {
    expect
} = require('chai');
const chai = require('chai');
const validators = require('../index');
const db = require('../../db');

describe('Email Checking', () => {
    beforeAll(async () => {
        await db.connect();
    });

    afterAll(async () => {
        await db.disconnect();
    });
    it('should return true if the email is unique', async () => {
        const address = 'neocheekiong@gmail.com';
        let result = await validators.user.isEmailUnique(address);
        expect(result).to.be.true;
    });
});
