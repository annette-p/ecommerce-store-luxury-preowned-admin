const express = require('express');
const router = express.Router();
const { createNewAdminForm, bootstrapField } = require('../forms');
const crypto = require('crypto');
// const { checkIfAuthenticated} = require('../middlewares');


const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

// main route - rediect to admin listing
router.get('/', (req, res) => {
    res.redirect('/users/admins')
})

// route to display all admin users
router.get('/admins', (req, res) => {
    res.render('users/admins', {
        adminListing: true
    })
})

// route to display all customer users
router.get('/customers', (req, res) => {
    res.render('users/customers', {
        customerListing: true
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
            let user = new User({
                'username': form.data.username,
                'password': getHashedPassword(form.data.password),
                'email': form.data.email
            });
            await user.save();
            req.flash('success_messages', "New admin has been signed up successfully");
            res.redirect('/users/login');
        }
    })
})


// route to process to update existing user details
router.post('/:user_id/update', async function (req, res) {})

module.exports = router; 