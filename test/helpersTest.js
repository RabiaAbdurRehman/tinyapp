const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
    "userRandomID": {
        id: "userRandomID",
        email: "user@example.com",
        password: "purple-monkey-dinosaur"
    },
    "user2RandomID": {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "dishwasher-funk"
    }
};

describe('getUserByEmail', function() {
    it('should return a user with valid email', function() {
        const actualEmail = "user@example.com";
        const user = getUserByEmail(actualEmail, testUsers);
        const expectedUserID = "userRandomID";
        // Write your assert statement here
        assert.strictEqual(actualEmail, user.email, 'these emails are strictly equal');
    });
    it('should return an undefined for a non-existent email', function() {
        const actualEmail = "client@example.com";
        const user = getUserByEmail(actualEmail, testUsers);
        const expectedUserID = "userRandomID";
        // Write your assert statement here
        assert.strictEqual(user, undefined, 'undefined');
    });
});