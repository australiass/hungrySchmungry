const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log("test");
    res.render('menu', { title: 'Menu' });
});

module.exports = router;