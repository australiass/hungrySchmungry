const express = require('express');
const router = express.Router();
const auth = require("../../utils/authenticateUser");

router.get('/', auth, (req, res) => {
    if (req.cookies.userEmail) {
        console.log(req.cookies.userEmail);
    }
    res.render('index', { title: 'Home' });
});

module.exports = router;