const express = require('express');
const router = express.Router();

const orderDataLayer = require("../dal/orders");

const {
    bootstrapField,
    createOrderUpdateForm
} = require('../forms');

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
        listOrders: true,
        orders: orders,
        orderSummary: orderSummary
    })
})

// route to display update order processing (shipment dispatch, consignment payment dispatch )
router.get('/:order_id/update', async (req, res) => {
    let orderId = req.params.order_id;
    const refreshToken = req.session.user.token
    let order = await orderDataLayer.getOrderById(orderId, refreshToken)
    const orderForm = createOrderUpdateForm();
    orderForm.fields.status.value = order['status'];
    orderForm.fields.shipment_provider.value = order.orderShipment['shipment_provider'];
    orderForm.fields.tracking_number.value = order.orderShipment['tracking_number'];
    orderForm.fields.comment.value = order['comment'];
    res.render('orders/update', {
        editOrder: true,
        order: order,
        orderForm: orderForm.toHTML(bootstrapField)
    })
})

// route to display update order processing (shipment dispatch, consignment payment dispatch )
router.post('/:order_id/update', async (req, res) => {})

module.exports = router; 