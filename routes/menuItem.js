const express = require('express');
const router = express.Router();

router.get('/:store/:id', (req, res) => {
    const store = decodeURIComponent(req.params.store);
    const item = decodeURIComponent(req.params.item);
    res.render('menuItem', { title: 'menuItem', store: store, item: item });
});

module.exports = router;