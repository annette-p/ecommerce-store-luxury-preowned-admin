const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('carts/listing', {})
})

// route to process tp update cart orders that was sent abandoned email
router.post('/:cart_id/update', async function (req, res) {})


module.exports = router; 