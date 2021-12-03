const express = require('express');
const router = express.Router();

const orderDataLayer = require("../dal/orders");

/*
    note: -- get the order history from stripe >> then to proceed to perform shipping dispatch 
*/


router.get('/', async (req, res) => {
    const refreshToken = req.session.user.token
    let orders = await orderDataLayer.getAllOrders(refreshToken);

    let orderStatuses = await orderDataLayer.getListOfValidOrderStatuses();
    let orderSummary = {}
    orderStatuses.forEach( status => orderSummary[status] = 0 )
    orders.forEach( order =>  orderSummary[order.status] += 1)

    res.render('orders/listing', {
        orders: orders,
        orderSummary: orderSummary
    })
})

// route to process tp update order processing (shipment dispatch, consignment payment dispatch )
router.post('/:order_id/update', async function (req, res) {})

module.exports = router; 