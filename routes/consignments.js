const express = require('express');
const router = express.Router();

const consignmentDataLayer = require("../dal/consignments");

const {
    bootstrapField,
    createConsignmentUpdateForm
} = require('../forms');

// Route to display list of consignments
router.get('/', async (req, res) => {

    // get the search critera from query string parameters in the route
    // e.g. /consignments?order_status=paid&search=prada
    // ref: http://expressjs.com/en/api.html#req.query
    const searchCriteria = req.query;

    // get the jwt refresh token from request session
    const refreshToken = req.session.user.token

    // call order DAL to retrieve all consignments. 
    let consignments = await consignmentDataLayer.getAllConsignments(refreshToken, searchCriteria);

    // call order DAL to retrieve the list of valid consignment statuses
    let consignmentStatuses = await consignmentDataLayer.getListOfValidConsignmentStatuses();

    // prepare an consignment summary on the number of consignments in each status
    let consignmentSummary = {}
    consignmentStatuses.forEach( status => consignmentSummary[status] = 0 )
    consignments.forEach( consignment =>  consignmentSummary[consignment.status] += 1)

    res.render('consignments/listing', {
        listConsignments: true,
        consignmentSummary: consignmentSummary,
        consignments: consignments,
        searchCriteria: searchCriteria
    })
})

// Route to display consignment update form
router.get('/:consignment_id/update', async function (req, res) {
    try {
        // the order id from request param
        let consignmentId = req.params.consignment_id;

        // get the jwt refresh token from request session
        const refreshToken = req.session.user.token;

        // retrieve the consignment by id
        let consignment = await consignmentDataLayer.getConsignmentById(consignmentId, refreshToken);

        // retrieve list of consignment statuses
        let allConsignmentStatuses = await consignmentDataLayer.getListOfValidConsignmentStatuses();

        // prepare the caolan form for order update, and pre-populate with the current order
        // details
        const consignmentForm = createConsignmentUpdateForm(allConsignmentStatuses);
        consignmentForm.fields.status.value = consignment['status'];
        consignmentForm.fields.comment.value = consignment['comment'];

        res.render('consignments/update', {
            editConsignments: true,
            consignment: consignment,
            consignmentForm: consignmentForm.toHTML(bootstrapField)
        })
    } catch(err) {
        req.flash('error_messages', `Failed to retrieve consignment id # ${consignmentId}`);
        res.redirect('/consignments')
    }
    
})

// route to process to update consignment processing (rejected, pending official evaluation, accepted, on listing)
router.post('/:consignment_id/update', async function (req, res) {
    // the order id from request param
    let consignmentId = req.params.consignment_id;

    // get the jwt refresh token from request session
    const refreshToken = req.session.user.token;

    try {
        // retrieve the consignment by id
        let consignment = await consignmentDataLayer.getConsignmentById(consignmentId, refreshToken);

        // retrieve list of consignment statuses
        let allConsignmentStatuses = await consignmentDataLayer.getListOfValidConsignmentStatuses();

        // prepare the caolan form for order update, and pre-populate with the current order
        // details
        const consignmentForm = createConsignmentUpdateForm(allConsignmentStatuses);

        consignmentForm.handle(req, {
            'error': (form) => {
                res.render('consignments/update', {
                    editConsignments: true,
                    consignment: consignment,
                    consignmentForm: form.toHTML(bootstrapField)
                })
            },
            'success': async (form) => {
                try {
                    // prepare the updated order data to be saved
                    let updatedConsignmentInfo = {
                        "status": form.data.status,
                        "comment": form.data.comment
                    }
    
                    // request update of order data
                    await consignmentDataLayer.updateConsignment(consignmentId, updatedConsignmentInfo, refreshToken)
    
                    // display flash message to show that order update successful, and redirect
                    // back to /consignments
                    req.flash('success_messages', `Consignment # ${consignmentId} updated successfully`);
                    res.redirect('/consignments');
                } catch(err) {
                    // Something went wrong and update of order failed. Stay on current page without
                    // page refresh
                    // ref: https://stackoverflow.com/a/25909604
                    console.log(err)
                    req.flash('error_messages', "Order update failed");
                    res.locals.error_messages = req.flash();
                    res.render('consignments/update', {
                        editOrder: true,
                        order: order,
                        orderForm: form.toHTML(bootstrapField)
                    })
                }
            }
        })
    } catch(err) {
        req.flash('error_messages', `Failed to retrieve/update consignment id # ${consignmentId}`);
        res.redirect('/consignments')
    }
})

module.exports = router; 