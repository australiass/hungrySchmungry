// Authenticate user
const readUsers = require("./readUsers"); // Pull the readUsers() function

function getUserData(userEmail) {
    data = readUsers();
    user = data.find(user => user.email === userEmail);
    return (user ? user : "User not found"); // Return the user if its set, otherwise "User not found"
}

module.exports = getUserData;