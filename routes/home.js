const express = require("express");
// create a new router object, Router() will return a new router object
const router = express.Router(); 
const { createAdminLoginForm, bootstrapField } = require('../forms');
const crypto = require('crypto');
// const { checkIfAuthenticated} = require('../middlewares');

// A router object can contain routes - Add a new route to the Express router
router.get('/', (req,res)=>{
    res.render("home/index")
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
            // retrieve user by the given email in the form
            let user = await User.where({
                'email': form.data.email
            }).fetch({
                'require': false
            })

            // if that user exists, then we check the password matches
            if (user) {
                if (user.get('password') == getHashedPassword(form.data.password)) {
                    // login
                    req.session.user = {
                        'id': user.get('id'),
                        'email': user.get('email'),
                        'username': user.get('username')
                    }
                    req.flash('success_messages', "Welcome back " + user.get('username'));
                    res.redirect('/users/profile');

                } else {
                    req.flash('error_messages', 'Login failed')
                    res.redirect('/users/login')
                }
            } else {
                req.flash('error_messages', 'Login failed')
                res.redirect('/users/login');
            }
        }
    })
})

router.get('/new-service', (req,res)=>{
    res.render("home/new-service")
})

module.exports = router; 