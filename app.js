const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const cookieParser = require("cookie-parser");

// Serve static files from the "public" dir (user can only see files from dir /public/)
app.use(express.static(path.join(__dirname, "public")));

// Use EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse JSON and cookies
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
	// Log cookie with user's email with 3 hours of validity
    res.cookie("userEmail", email, { maxAge: 180 * 60 * 1000 });

    res.status(200).json({ message: "Login successful" });
})

// Logout
app.post("/logout", (req, res) => {
    res.cookie("userEmail", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out" });
})

// Add item to cart
app.post("/addItemToCart", (req, res) => {
    userEmail = req.cookies.userEmail;

    const users = readUsers();

	// Get user based off their email cookie
    const user = users.find(user => user.email === userEmail);
	// Get a seperate copy of user to not lose the original if something messes up
    const userUpdated = user;
    if (user) {
        let store = req.body.store;
        let item = req.body.item;
		// If the user has no items from this store in their cart
        if (!userUpdated.cart[store]) {
            userUpdated.cart[store] = {};
        }
		// If the user doesn't have any variations of this item in their cart
        if (!userUpdated.cart[store][item]) {
            userUpdated.cart[store][item] = [];
        }
        let match;
        let first = true // If unchanged, know by the end to allow the variation to be added even though a match won't be found
        for (let itemVariation in userUpdated.cart[store][item])  { // Loop the user's cart>store>item array 
            first = false; // Set to false because there was items within the array, so it isn't the first item
            var lastVariation = itemVariation; // This will be overridden until the loop is broken, which will mean a match was found
            match = false; // Match is set to false for every variation because 
            for (let key in req.body.data.IngredientData) { // Loop through each ingredient
                if (userUpdated.cart[store][item][itemVariation][key] === req.body.data.IngredientData[key]) {
                    match = true // Tells that a match was found
                } else {
                    match = false; // Tells that a non-match was found, then break loop because once there's a non match, there's no way- 
                    break; // -that there can be a total match
                }
            }
            if (match) { // If match was true for every element of the map, we've found the variation that matches the item we're trying to add
                break;
            }
        }
        if (match == false && first == true) { // Apply the 'first' variable here to ensure the variation is added
            match = true;
        }
        if (match == true) { // Match was found and add 1 to the [amount] key of that variation
            userUpdated.cart[store][item][lastVariation]["amount"] += 1;
        } else { // This variation didn't exist, so create a new map and append it to the array with the new [amount] key
            var ingredientData = req.body.data.IngredientData;
            ingredientData["amount"] = 1;
            userUpdated.cart[store][item].push(ingredientData);
        }

    //Add new user to database
    users.user = userUpdated;
    writeUsers(users);
    res.status(200).json({ message: "Added!" });
}})

// Remove item from cart
app.post("/removeItemFromCart", (req, res) => {
	// Pull user's data map again
    userEmail = req.cookies.userEmail;
    const users = readUsers();
    const user = users.find(user => user.email === userEmail);

	// Set variables to the values sent in the request
    let item = req.body.item;
    let store = req.body.store;
    let variation = req.body.variation;

    if (user) {
		// Override the user's cart data, excluding the item being removed which was specified in the request
        user['cart'][store][item] = user['cart'][store][item].filter((filteredItem) => {
            return JSON.stringify(variation) !== JSON.stringify(filteredItem);
        })
		// If the cart > store > item has no contents, remove it from the cart to save database space
        if (Object.keys(user['cart'][store][item]).length == 0) {
            delete user['cart'][store][item];
        }
		// If the cart > store has no contents, remove it to save space also
        if (Object.keys(user['cart'][store]).length == 0) {
            delete user['cart'][store];
        }
		// Update database
		users.user = user;
        writeUsers(users);

        res.status(200).json({ message: "Removed item" });
    }
})

// Reset Cart
app.post("/resetCart", (req, res) => {
	// Get the user
	userEmail = req.cookies.userEmail;
	const users = readUsers();
    const user = users.find(user => user.email === userEmail);
	// Empty the user's cart
	user['cart'] = {};
	// Update database
	users.user = user;
	writeUsers(users);

	res.status(200).json({ message: "Reset cart" });
})

// Upload menu data to api for the front end to use without exposing data directly to the user
app.get("/api/menudata", (req, res) => {
    var menuData = path.join(__dirname, "menuData.json");
    var menuData = fs.readFileSync(menuData, 'utf8');
    res.status(200).json(menuData);
})

// Create an api path for each individual item so the front end can get a specific item easily
app.get("/api/menudata/:store/:item", (req, res) => {
	// Decode the parameters to get the raw string of the store and item. Before this they contain %20 in place of spaces
    const store = decodeURIComponent(req.params.store);
    const item = decodeURIComponent(req.params.item);

	// Get menu data
    var menuData = path.join(__dirname, "menuData.json");
    menuData = fs.readFileSync(menuData, 'utf8');
    menuData = JSON.parse(menuData);

	// Find the store and get the item within that store. Needed to get the store incase some places had items with the same name.
    storeData = menuData.find(entry => entry.store === store);
    const menuItemData = storeData.menu[item];
    
    if (menuItemData) {
        res.status(200).json(menuItemData);
    } else {
        res.status(404).send("Item not found.");
    }
})

// Define routes for each page
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