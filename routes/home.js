const express = require("express");
// create a new router object, Router() will return a new router object
const router = express.Router();
const axios = require("axios");

const { createAdminLoginForm, bootstrapField } = require('../forms');
const crypto = require('crypto');
// const { checkIfAuthenticated} = require('../middlewares');

const apiUrl = process.env.BACKEND_API_ENDPOINT

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
            let loginInfo = {
                username: form.data.username,
                password: form.data.password
            }

            await axios.post(`${apiUrl}/users/authenticate`, loginInfo)
            .then( async (authResult) => {

                const tokens = authResult.data

                const headers = {
                    "Authorization": `Bearer ${tokens.accessToken}`
                };
                // login successful
                await axios.get(`${apiUrl}/users/info`, { headers: headers})
                .then( (userInfoResult) => {
                    const userInfo = userInfoResult.data.data

                    if (userInfo.type === "Admin") {
                        req.session.user = {   
                            "info": userInfo,
                            "token": tokens.refreshToken
                        }
                        res.redirect('/')
                    } else {
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
    req.session.user = null;
    req.flash('success_messages', "Logged out successfully");
    res.redirect('/login');
});

router.get('/new-service', (req,res)=>{
    res.render("home/new-service")
})

module.exports = router; 