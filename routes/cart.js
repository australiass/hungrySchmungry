const express = require('express');
const router = express.Router();
const auth = require("../utils/authenticateUser");
const getUserData = require("../utils/getUserData");

router.get('/', auth, (req, res) => {
    user = getUserData(req.cookies.userEmail);
    res.render('cart', { title: 'cart', userData: user });
});

module.exports = router;