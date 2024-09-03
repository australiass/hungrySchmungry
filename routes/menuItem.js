const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    const itemId = req.params.id;
    console.log(itemId);
    res.render('menuItem', { title: 'menuItem', itemId: itemId });
});

module.exports = router;