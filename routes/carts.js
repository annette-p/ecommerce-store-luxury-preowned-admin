const express = require('express');
const router = express.Router();

const cartDataLayer = require("../dal/carts");

router.get('/', async (req, res) => {
    let carts = await cartDataLayer.getAllCarts(req.session.user.token);
    carts.forEach(cart => {
        cart.numberOfItems = cart.products.length
        let total = 0
        cart.products.forEach( product => {
            total += parseFloat(product.selling_price) * product["_pivot_quantity"]
        })
        cart.totalAmount = total.toFixed(2)
    })
    res.render('carts/listing', {
        carts: carts
    })
})

// route to process tp update cart orders that was sent abandoned email
router.post('/:cart_id/update', async function (req, res) {})


module.exports = router; 