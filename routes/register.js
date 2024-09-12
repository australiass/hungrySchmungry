const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.cookies.userEmail) {
        res.redirect("/menu");
    } else {
        res.render('register', { title: 'Register' });
    }
});

module.exports = router;