const express = require('express');
const router = express.Router();
const auth = require("../utils/authenticateUser");

router.get('/', auth, (req, res) => {
    res.render('menu', { title: 'Menu' });
});

module.exports = router;