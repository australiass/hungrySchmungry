const fs = require("fs");
const path = require("path");
// get the database file
const usersFilePath = path.join(__dirname, "../users.json");

const readUsers = () => {
    try {
		// Return the whole database
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error);
        return "Error reading users";
    }
};

module.exports = readUsers;