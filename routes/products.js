const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('products/listing', {})
})

router.get('/add', (req, res) => {
    res.render('products/add', {})
})

module.exports = router; 