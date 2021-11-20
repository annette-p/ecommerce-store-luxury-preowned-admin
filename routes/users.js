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


// route to display all users (admin, customer) and route to add new "admin" user 
router.get('/', (req, res) => {
    const adminSignUpForm = createNewAdminForm();
    res.render('users/listing', {
        adminSignUpForm: adminSignUpForm.toHTML(bootstrapField)
    })
})

// route to add new "admin" user  -->> dont need anymore
// router.get('/register', (req,res)=>{
//     const adminSignUpForm = createNewAdminForm();
//     res.render('users/listing',{
//         adminSignUpForm: adminSignUpForm.toHTML(bootstrapField)
//     })
// });

// route to process registering new "admin" user 
router.post('/register', (req,res)=>{
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