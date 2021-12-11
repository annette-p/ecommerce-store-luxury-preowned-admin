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

// Route to display list of orders
router.get('/', async (req, res) => {

    // get the search critera from query string parameters in the route
    // e.g. /orders?order_status=paid&search=prada
    // ref: http://expressjs.com/en/api.html#req.query
    const searchCriteria = req.query;

    // get the jwt refresh token from request session
    const refreshToken = req.session.user.token

    // call order DAL to retrieve all orders. 
    let orders = await orderDataLayer.getAllOrders(refreshToken, searchCriteria);

    // call order DAL to retrieve the list of valid order statuses
    let orderStatuses = await orderDataLayer.getListOfValidOrderStatuses();

    // prepare an order summary on the number of orders in each order status
    let orderSummary = {}
    orderStatuses.forEach( status => orderSummary[status] = 0 )
    orders.forEach( order =>  orderSummary[order.status] += 1)

    // render the hbs for order listing
    res.render('orders/listing', {
        listOrders: true,
        orders: orders,
        orderSummary: orderSummary,
        searchCriteria: searchCriteria
    })
})

// route to display the Update Order form for a selected order
router.get('/:order_id/update', async (req, res) => {
    // the order id from request param
    let orderId = req.params.order_id;

    // get the jwt refresh token from request session
    const refreshToken = req.session.user.token;

    // retrieve the order by id
    let order = await orderDataLayer.getOrderById(orderId, refreshToken);

    // retrieve list of order statuses
    let allOrderStatuses = await orderDataLayer.getListOfValidOrderStatuses();

    // retrieve list of shipment providers
    let allShipmentProviders = await orderDataLayer.getListOfShipmentProviders();

    // prepare the caolan form for order update, and pre-populate with the current order
    // details
    const orderForm = createOrderUpdateForm(allOrderStatuses, allShipmentProviders);
    orderForm.fields.status.value = order['status'];
    orderForm.fields.shipment_provider.value = order.orderShipment[0]['shipment_provider'];
    orderForm.fields.tracking_number.value = order.orderShipment[0]['tracking_number'];
    orderForm.fields.comment.value = order['comment'];

    res.render('orders/update', {
        editOrder: true,
        order: order,
        orderForm: orderForm.toHTML(bootstrapField)
    })
})

// route to perform the update order processing 
// - only specific info about order can be modified. Mainly on the shipping details, 
//   and order status
router.post('/:order_id/update', async (req, res) => {
    // the order id from request param
    let orderId = req.params.order_id;

    // get the jwt refresh token from request session
    const refreshToken = req.session.user.token;

    // retrieve the order by id
    let order = await orderDataLayer.getOrderById(orderId, refreshToken);

    // retrieve list of order statuses
    let allOrderStatuses = await orderDataLayer.getListOfValidOrderStatuses();

    // retrieve list of shipment providers
    let allShipmentProviders = await orderDataLayer.getListOfShipmentProviders();

    // prepare the caolan form for order update
    const orderForm = createOrderUpdateForm(allOrderStatuses, allShipmentProviders);

    orderForm.handle(req, {
        'error': (form) => {
            res.render('orders/update', {
                editOrder: true,
                order: order,
                orderForm: form.toHTML(bootstrapField)
            })
        },
        'success': async (form) => {
            try {
                // prepare the updated order data to be saved
                let updatedOrderInfo = {
                    "status": form.data.status,
                    "comment": form.data.comment,
                    "shipment_provider": form.data.shipment_provider,
                    "tracking_number": form.data.tracking_number
                }

                // request update of order data
                await orderDataLayer.updateOrder(orderId, updatedOrderInfo, refreshToken)

                // display flash message to show that order update successful, and redirect
                // back to /orders
                req.flash('success_messages', `Order # ${orderId} updated successfully`);
                res.redirect('/orders');
            } catch(err) {
                // Something went wrong and update of order failed. Stay on current page without
                // page refresh
                // ref: https://stackoverflow.com/a/25909604
                console.log(err)
                req.flash('error_messages', "Order update failed");
                res.locals.error_messages = req.flash();
                res.render('orders/update', {
                    editOrder: true,
                    order: order,
                    orderForm: form.toHTML(bootstrapField)
                })
            }
        }
    })
})

module.exports = router; 