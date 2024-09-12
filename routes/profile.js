const express = require('express');
const router = express.Router();
const auth = require("../utils/authenticateUser");
const getUserData = require("../utils/getUserData");

router.get('/', auth, (req, res) => {
    user = getUserData(req.cookies.userEmail);
    res.render('profile', { title: 'profile', userData: user });
});

module.exports = router;