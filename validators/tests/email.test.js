const { expect } = require('chai');
const validators = require('../index');

describe('Email Checking', () => {
    it('should return true if the string is an email', () => {
        const address = 'neocheekiong@gmail.com';
        let result = validators.user.isStringValid(address)('email');
        expect(result).to.be.true;
    });

    it('should return false if the string is not an email', () => {
        const address = 'neocheekiongatgmail.com';
        let result = validators.user.isStringValid(address)('email');
        expect(result).to.be.false;
    });

    it('should return false if the string contains a string of .', () => {
        const address = 'neocheekiong@gmail...com';
        let result = validators.user.isStringValid(address)('email');
        expect(result).to.be.false;
    });
});

describe('Password Checking', () => {
    it('true when the password contains special char, min 10 char, 1+ Uppercase 1+ lowercase', () => {
        const password = 'abc123ABC*';
        let result = validators.user.isStringValid(password)('password');
        expect(result).to.be.true;
    });

    it('should return false if the string fails to contain a number', () => {
        const password = 'abcdefABC*';
        let result = validators.user.isStringValid(password)('password');
        expect(result).to.be.false;
    });

    it('should return false if the string is shorter than 10 chars', () => {
        const password = 'AbC123*';
        let result = validators.user.isStringValid(password)('password');
        expect(result).to.be.false;
    });

    it('should return false if the string fails to include special char', () => {
        const password = 'AbC123Howareyou';
        let result = validators.user.isStringValid(password)('password');
        expect(result).to.be.false;
    });

    it('should return false if the string fails to include Uppercase char', () => {
        const password = 'AbC123Howareyou/';
        let result = validators.user.isStringValid(password.toLowerCase)('password');
        expect(result).to.be.false;
    });

    it('should return false if the string fails to include lowercase char', () => {
        const password = 'AbC123Howareyou+';
        let result = validators.user.isStringValid(password.toUpperCase)('password');
        expect(result).to.be.false;
    });
});
