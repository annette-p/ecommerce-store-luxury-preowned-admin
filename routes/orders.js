const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('orders/listing', {})
})

// route to process tp update order processing (shipment dispatch, consignment payment dispatch )
router.post('/:order_id/update', async function (req, res) {})

module.exports = router; 