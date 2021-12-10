const express = require("express");
// create a new router object, Router() will return a new router object
const router = express.Router();
const axios = require("axios");

const { createAdminLoginForm, bootstrapField } = require('../forms');
const orderDataLayer = require("../dal/orders");
const consignmentDataLayer = require("../dal/consignments");
const productDataLayer = require("../dal/products");
const authServiceLayer = require("../services/authentication");

// A router object can contain routes - Add a new route to the Express router
router.get('/', async (req,res)=>{

    // get the jwt refresh token from request session
    const refreshToken = req.session.user.token

    // call order DAL to retrieve all orders. 
    let orders = await orderDataLayer.getAllOrders(refreshToken);

    // prepare order summary and total sales
    let totalSales = 0;
    let orderSummary = {
        "Pending": 0,
        "Processed": 0,
        "Cancelled": 0,
        "Total": 0
    }

    orders.forEach( order => {
        
        if (["New", "Paid", "Processing"].includes(order.status)) {

            // If order status is "New" or "Processing", classify as "Pending"
            orderSummary["Pending"] += 1
            totalSales = totalSales + order.payment_amount

        } else if (["Shipment", "Completed"].includes(order.status)) {

            // If order status is "Shipment" or "Completed", classify as "Processed"
            orderSummary["Processed"] += 1
            totalSales = totalSales + order.payment_amount

        } else {

            // The remaining order statuses would be classified as "Cancelled",
            // and no need to add to the total sales
            orderSummary["Cancelled"] += 1

        }
        orderSummary["Total"] += 1
    })

    // call order DAL to retrieve all consignments. 
    let consignments = await consignmentDataLayer.getAllConsignments(refreshToken);

    // prepare consignment summary
    let consignmentSummary = {
        "Pending": 0,
        "Processed": 0,
        "Cancelled": 0,
        "Total": 0
    }

    consignments.forEach( order => {
        if (["New", "Initial Evaluation", "Official Evaluation"].includes(order.status)) {
            // If consignment status is "New", "Initial Evaluation" or "Official Evaluation", classify as "Pending"
            consignmentSummary["Pending"] += 1
        } else if (["Shipment", "Listed"].includes(order.status)) {
            // If consignment status is "Shipment" or "Listed", classify as "Processed"
            consignmentSummary["Processed"] += 1
        } else {
            // The remaining consignment statuses would be classified as "Cancelled",
            consignmentSummary["Cancelled"] += 1
        }
        consignmentSummary["Total"] += 1
    })

    // Retrieve list of products
    let products = await productDataLayer.getAllProducts();

    // Retrieve list of customers
    let headers = await authServiceLayer.generateHttpAuthzHeader(refreshToken);
    if (headers === null) {
        req.flash('error_messages', 'Login session expired')
        res.redirect('/login')
    }
    let customers = await axios.get(`${apiUrl}/users/customers`, headers)

    // Pass the prepared data to the hbs file for rendering
    res.render("home/index", {
        customers, products, orderSummary, consignmentSummary, totalSales
    })
})

// router to display admin login form
router.get('/login', (req,res)=>{
    const adminLoginForm = createAdminLoginForm();
    res.render("home/login",{
        'adminLoginForm': adminLoginForm.toHTML(bootstrapField)
    });
})

// router to process admin login
router.post('/login', (req,res)=>{
    const adminLoginForm = createAdminLoginForm();
    adminLoginForm.handle(req,{
        'error': (form)=> {
            res.render("home/login",{
                'adminLoginForm': form
            })
        },
        'success': async(form) => {

            let loginInfo = {
                username: form.data.username,
                password: form.data.password
            }

            // Initiate authentication by passing the provided username/password 
            // to the backend api
            await axios.post(`${apiUrl}/users/authenticate`, loginInfo)
            .then( async (authResult) => {

                // Login Success

                // when authentication is successful, backend api will return the access token
                // and refresh token
                const tokens = authResult.data

                // Using the access token, query the backend api to get the information of the
                // authenticated user.
                const headers = {
                    "Authorization": `Bearer ${tokens.accessToken}`
                };
                await axios.get(`${apiUrl}/users/info`, { headers: headers})
                .then( (userInfoResult) => {
                    const userInfo = userInfoResult.data.data

                    // Check whether the authenticated user is an Admin
                    if (userInfo.type === "Admin") {

                        // Yes, authenticated user is an Admin.

                        // Save the user information and refresh token in session
                        req.session.user = {   
                            "info": userInfo,
                            "token": tokens.refreshToken
                        }

                        // Check whether this is the first time that the user is logging in
                        // If it is first time, the "lastLogin" information will be null / empty
                        if (tokens.lastLogin) {
                            // NOT first login. Redirect to home page
                            res.redirect('/')
                        } else {
                            // It is the first login.

                            // Redirect user to change password page, and set session variable "user.passwordExpired"
                            // as true as a way to ensure that user change the password.
                            req.session.user.passwordExpired = true
                            req.flash('success_messages', "Welcome! Please change your initial password :)");
                            res.redirect('/settings/change-password');
                        }
                        
                    } else {

                        // User is not an admin
                        req.flash('error_messages', 'Unauthorized')
                        res.redirect('/login')
                    }
                    
                })
                
            }).catch( (_err) => {
                req.flash('error_messages', 'Login failed')
                res.redirect('/login')
            })
        }
    })
})

// router to process admin logout 
router.get('/logout', (req,res)=>{
    if (req.session.user) {
        req.session.user = null;
        req.flash('success_messages', "Logged out successfully");
    }
    res.redirect('/login');
});

router.get('/new-service', (req,res)=>{
    res.render("home/new-service")
})

module.exports = router; 