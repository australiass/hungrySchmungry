const fs = require("fs");
path = require("path");
const usersFilePath = path.join(__dirname, "../users.json");

const readUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
};

module.exports = readUsers;