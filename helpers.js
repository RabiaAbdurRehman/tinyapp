//Helper functions:
// 1)To create unique Id
function generateRandomString() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let resultNumber = '';
    for (let i = 0; i < 6; i++) {
        resultNumber += chars[Math.floor(Math.random() * chars.length)];
    }
    return resultNumber;
}
// 2)checking duplicate emails
function getUserByEmail(email, users) {
    for (const userId in users) {
        if (users[userId].email === email) {
            return users[userId];
        }
    }
    return;
}
function urlsForUser(user, urlDatabase) {
    const userUrls = {};
    for (const id in urlDatabase) {
        if (urlDatabase[id].userId === user.id) {
            userUrls[id] = urlDatabase[id];
        }

    }
    return userUrls;
}
module.exports = { getUserByEmail, generateRandomString, urlsForUser };