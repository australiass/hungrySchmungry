// Authenticate user
const readUsers = require("./readUsers");

function getUserData(userEmail) {
    data = readUsers();
    user = data.find(user => user.email === userEmail);
    return (user ? user : "User not found");
}

module.exports = getUserData;