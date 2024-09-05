const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper functions relating to the database
const usersFilePath = path.join(__dirname, "users.json");

// Function to read users from the JSON file
const readUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
};

// Function to write users to the JSON file
const writeUsers = (users) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing users file:', error);
    }
};

// Register endpoint
app.post('/register', (req, res) => {

    const { name, email, password } = req.body;
    const users = readUsers();

    // Check if email already exists in database
    if (Array.isArray(users) && users.some(user => user.email === email)) {
        return res.status(400).json({ message: 'Email unavailable' });
    }

    // Add new user to database
    users.push({ name, email, password });
    writeUsers(users);
    res.status(200).json({ message: 'Registration successful' });
});

// Login endpoint
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();

    // Find a user in the database where the email is the same as the input email, and the password is the same as the input password
    const user = Array.isArray(users) && users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: "Login successful" });
})

// Upload menu data to api
app.get("/api/menudata", (req, res) => {
    var menuData = path.join(__dirname, "menuData.json");
    var menuData = fs.readFileSync(menuData, 'utf8');
    console.log("upload original menu data to api");
    res.json(menuData)
})

app.get("/api/menudata/:store/:item", (req, res) => {
    const store = decodeURIComponent(req.params.store);
    const item = decodeURIComponent(req.params.item);
    console.log("Fetching", item, "from", store);
    var menuData = path.join(__dirname, "menuData.json");
    var menuData = fs.readFileSync(menuData, 'utf8');
    var menuItem = menuData[store] ? menuItems[store][item] : null;
    console.log("uploading individual item data to api");
    if (menuItem) {
        console.log("success");
        res.json(menuItem);
    } else {
        res.status(404).send("Item not found.");
        console.log("fail");
    }
})

// Define routes
const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const menuRouter = require("./routes/menu");
const menuItemRouter = require("./routes/menuItem");
app.use("/", indexRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/menu", menuRouter);
app.use("/menuItem", menuItemRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});