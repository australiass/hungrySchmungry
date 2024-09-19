const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const cookieParser = require("cookie-parser");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Setting up file paths
const usersFilePath = path.join(__dirname, "users.json");
const readUsers = require("./utils/readUsers");

// Function to write users to the JSON file
const writeUsers = (users) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing users file:', error);
    }
};

// Function to get a specific user

// Register endpoint
app.post('/register', (req, res) => {

    const { name, email, password } = req.body;
    const users = readUsers();

    // Check if email already exists in database
    if (Array.isArray(users) && users.some(user => user.email === email)) {
        return res.status(400).json({ message: 'Email unavailable' });
    }

    // Add new user to database
    users.push({ name, email, password, cart: {} });
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
    res.cookie("userEmail", email, { maxAge: 180 * 60 * 1000 });
    res.status(200).json({ message: "Login successful" });
    console.log(`User ${email} logged in successfully.`)
})

// Logout
app.post("/logout", (req, res) => {
    console.log(`Logging out ${req.cookies.userEmail}.`);
    res.cookie("userEmail", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out" });
})

// Add item to cart
app.post("/addItemToCart", (req, res) => {
    userEmail = req.cookies.userEmail;


    const users = readUsers();

    const user = users.find(user => user.email === userEmail);
    const userUpdated = user;
    if (user) {
        let store = req.body.store;
        let item = req.body.item;
        if (!userUpdated.cart[store]) {
            userUpdated.cart[store] = {};
            console.log("added", store);
        }
        if (!userUpdated.cart[store][item]) {
            userUpdated.cart[store][item] = [];
            console.log("added", item);
        }
        let match;// If unchanged, tells code that it matches and we have to add 1 to the amount key
        let first = true
        for (let itemVariation in userUpdated.cart[store][item])  { // Loop each store/item: array (int)
            console.log("Loop ", itemVariation);
            first = false;
            var lastVariation = itemVariation;
            match = false;
            for (let key in req.body.data.IngredientData) { // Loop through each key in request data (key)
                console.log("   - Key:", key, "->", req.body.data.IngredientData[key], " vs ", userUpdated.cart[store][item][itemVariation][key]);
                if (userUpdated.cart[store][item][itemVariation][key] === req.body.data.IngredientData[key]) {
                    match = true // Tells code that we need to make a new array for this variation
                    console.log("Match above");
                } else {
                    match = false;
                    console.log("Individual non-match above");
                    break;
                }
            }
            if (match) {
                console.log("Breaking outer loop")
                break;
            }
        }
        if (match == false && first == true) {
            console.log("This is the first time this item is being added to the cart");
            match = true;
        }
        if (match == true) {
            console.log("Match found");
            userUpdated.cart[store][item][lastVariation]["amount"] += 1;
        } else {
            console.log("Non-match found");
            var ingredientData = req.body.data.IngredientData;
            ingredientData["amount"] = 1;
            userUpdated.cart[store][item].push(ingredientData);
        }

    //Add new user to database
    users.user = userUpdated;
    writeUsers(users);
    res.status(200).json({ message: "Added!" });
}})

// Upload menu data to api
app.get("/api/menudata", (req, res) => {
    var menuData = path.join(__dirname, "menuData.json");
    var menuData = fs.readFileSync(menuData, 'utf8');
    console.log("Uploaded original menu data to api");
    res.json(menuData)
})

app.get("/api/menudata/:store/:item", (req, res) => {
    const store = decodeURIComponent(req.params.store);
    const item = decodeURIComponent(req.params.item);
    console.log("Fetching", item, "from", store);
    var menuData = path.join(__dirname, "menuData.json");
    menuData = fs.readFileSync(menuData, 'utf8');
    menuData = JSON.parse(menuData);

    storeData = menuData.find(entry => entry.store === store);
    const menuItemData = storeData.menu[item];
    
    if (menuItemData) {
        console.log("success");
        res.json(menuItemData);
    } else {
        res.status(404).send("Item not found.");
        console.log("Item not found");
    }
})

// Define routes
const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const menuRouter = require("./routes/menu");
const menuItemRouter = require("./routes/menuItem");
const profileRouter = require("./routes/profile");
const cartRouter = require("./routes/cart");
app.use("/", indexRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/menu", menuRouter);
app.use("/menuItem", menuItemRouter);
app.use("/profile", profileRouter);
app.use("/cart", cartRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});