const express = require('express');
const router = express.Router();
const axios = require("axios");

const { 
    bootstrapField,
    createNewAdminForm,
    displayAdminProfileForm 
} = require('../forms');

// main route - rediect to admin listing
router.get('/', (req, res) => {
    res.redirect('/users/admins')
})

// route to display all admin users
router.get('/admins', async (req, res) => {
    await axios.get(`${apiUrl}/users/admins`)
    .then( admins => {
        res.render('users/admins', {
            adminListing: true,
            admins: admins.data.data
        })  
    })
})

// route to display all customer users
router.get('/customers', async (req, res) => {
    await axios.get(`${apiUrl}/users/admins`)
    .then( customers => {
        res.render('users/customers', {
            customerListing: true,
            customers: customers.data.data
        })  
    })
})

// route to register new "admin" user 
router.get('/admins/register', (req,res)=>{
    const adminSignUpForm = createNewAdminForm();
    res.render('users/register',{
        addNewAdminAccount: true,
        adminSignUpForm: adminSignUpForm.toHTML(bootstrapField)
    })
});

// route to process registering new "admin" user 
router.post('/admins/register', (req,res)=>{
    const adminSignUpForm = createNewAdminForm();
    adminSignUpForm.handle(req,{
        'error': (form) => {
            res.render('users/register',{
                adminSignUpForm: form.toHTML(bootstrapField)
            })
        },
        'success': async(form) => {

            let headerRefreshToken = {
                'Content-Type': 'application/json'
            }
            let accessTokenResult = await axios.post(`${apiUrl}/users/refresh`, {
                "refresh_token": req.session.user.token
            }, {
                headers: headerRefreshToken
            })
            if (!accessTokenResult) {
                req.flash('error_messages', 'Login session expired')
                res.redirect('/login')
            }

            let newAdminInfo = {
                "type": "Admin",
                "firstname": form.data.firstname,
                "lastname": form.data.lastname,
                "email": form.data.email,
                "username": form.data.username,
                "password": form.data.password,
            }

            let headerAuthToken = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessTokenResult.data.accessToken}`
            }

            let newAdminResult = await axios.post(`${apiUrl}/users/create`, newAdminInfo, {
                headers: headerAuthToken
            })

            if (newAdminResult) {
                req.flash('success_messages', "New admin has been signed up successfully");
                res.redirect('/users/admins');
            }
        }
    })
})


// route to process to update existing user details
router.post('/:user_id/update', async function (req, res) {})

module.exports = router; 