const express = require('express');
const router = express.Router();
const axios = require("axios");

const authServiceLayer = require("../services/authentication");

const { 
    bootstrapField,
    createNewAdminForm,
    displayAdminProfileForm 
} = require('../forms');

// route to display all admin users
router.get('/admins', async (req, res) => {
    let headers = await authServiceLayer.generateHttpAuthzHeader(req.session.user.token);
    if (headers === null) {
        req.flash('error_messages', 'Login session expired')
        res.redirect('/login')
    }
    await axios.get(`${apiUrl}/users/admins`, headers)
    .then( admins => {
        res.render('users/admins', {
            adminListing: true,
            admins: admins.data.data
        })  
    })
})

// route to display all customer users
router.get('/customers', async (req, res) => {
    let headers = await authServiceLayer.generateHttpAuthzHeader(req.session.user.token);
    if (headers === null) {
        req.flash('error_messages', 'Login session expired')
        res.redirect('/login')
    }
    await axios.get(`${apiUrl}/users/customers`, headers)
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

            let headers = await authServiceLayer.generateHttpAuthzJsonHeader(req.session.user.token);
            if (headers === null) {
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

            let newAdminResult = await axios.post(`${apiUrl}/users/create`, newAdminInfo, headers)

            if (newAdminResult) {
                req.flash('success_messages', "New admin has been signed up successfully");
                res.redirect('/users/admins');
            }
        }
    })
})

// route to process to activate existing user 
router.get('/:user_id/activate', async function (req, res) {
    const userId = req.params.user_id
    try {
        const headers = await authServiceLayer.generateHttpAuthzJsonHeader(req.session.user.token);
        if (headers === null) {
            req.flash('error_messages', 'Login session expired')
            res.redirect('/login')
        }

        const newUserInfo = {
            "active": true
        }

        await axios.put(`${apiUrl}/users/${userId}/update`, newUserInfo, headers)
        req.flash('success_messages', `User id ${userId} activated successfully`);
        res.redirect('back');
        
    } catch(_err) {
        req.flash('error_messages', `Unable to activate user id ${userId}`)
        res.redirect('back');
    }
})

// route to process to activate existing user 
router.get('/:user_id/deactivate', async function (req, res) {
    const userId = req.params.user_id
    try {
        const headers = await authServiceLayer.generateHttpAuthzJsonHeader(req.session.user.token);
        if (headers === null) {
            req.flash('error_messages', 'Login session expired')
            res.redirect('/login')
        }

        const newUserInfo = {
            "active": false
        }

        await axios.put(`${apiUrl}/users/${userId}/update`, newUserInfo, headers)
        req.flash('success_messages', `User id ${userId} deactivated successfully`);
        res.redirect('back');
        
    } catch(_err) {
        req.flash('error_messages', `Unable to deactivate user id ${userId}`)
        res.redirect('back');
    }
})

// main route - rediect to admin listing
router.get('/', (req, res) => {
    res.redirect('/users/admins')
})

module.exports = router; 