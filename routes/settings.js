const express = require('express');
const router = express.Router();
const axios = require("axios");

const { bootstrapField, createChangePasswordForm, displayAdminProfileForm } = require('../forms');
// const crypto = require('crypto');
// const session = require('express-session');
// const { checkIfAuthenticated} = require('../middlewares');


// const getHashedPassword = (password) => {
//     const sha256 = crypto.createHash('sha256');
//     const hash = sha256.update(password).digest('base64');
//     return hash;
// }

// main route - rediect to profile
router.get('/', (req, res) => {
    res.redirect('/settings/profile')
})

// router.get('/settings', [checkIfAuthenticated], (req,res)=>{})  --> to use htis instead
router.get('/profile',(req,res)=>{
    // const changePasswordForm = createChangePasswordForm();
    const adminProfileForm = displayAdminProfileForm();

    // call api to get profile info
    adminProfileForm.fields.firstname.value = req.session.user.info.firstname;
    adminProfileForm.fields.lastname.value = req.session.user.info.lastname;
    adminProfileForm.fields.email.value = req.session.user.info.email;

    res.render('settings/profile',{
        // 'user': req.session.user
        updateMyProfile: true, // to control the tab selection
        adminProfileForm: adminProfileForm.toHTML(bootstrapField)
    })
})

router.post('/profile',(req,res)=>{
    // const changePasswordForm = createChangePasswordForm();
    const adminProfileForm = displayAdminProfileForm();
    adminProfileForm.handle(req, {
        'error': (form) => {
            res.render('settings/profile',{
                adminProfileForm: form.toHTML(bootstrapField)
            })
        },
        'success': async(form) => {
            try{

                // use refresh token to obtain a new access token
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

                // use access token to send request to backend api to perform profile update
                let newProfileInfo = {
                    "firstname": form.data.firstname,
                    "lastname": form.data.lastname,
                    "email": form.data.email
                }

                let headerAuthToken = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessTokenResult.data.accessToken}`
                }

                let updateAdminResult = await axios.put(`${apiUrl}/users/update`, newProfileInfo, {
                    headers: headerAuthToken
                })

                // check whether update is successful
                if (updateAdminResult) {

                    // profile update successful

                    req.flash('success_messages', "Profile updated successfully");

                    // when email address is changed, there is a need to re-login because the subject attribute 
                    // of the refresh token is tied to the user's email address
                    const needRelogin = newProfileInfo.email === req.session.user.info.email ? false : true

                    if (needRelogin) {
                        res.redirect('/logout');
                    } else {
                        // retrieve latest user info from backend api, and update the user's info in the session

                        await axios.get(`${apiUrl}/users/info`, { headers: headerAuthToken})
                        .then( (userInfoResult) => {
                            const userInfo = userInfoResult.data.data

                            req.session.user.info = userInfo;
                            
                        })
                        res.redirect('/settings/profile');
                    }
                    
                }
            } catch(err) {
                req.flash('error_messages', "Profile update failed due to unexpected error");
            }
            
        }
    })
    
})

router.get('/change-password',(req,res)=>{
    const changePasswordForm = createChangePasswordForm();
    
    res.render('settings/change-password',{
        // 'user': req.session.user
        changePassword: true, // to control the tab selection
        changePasswordForm: changePasswordForm.toHTML(bootstrapField)
    })
})

router.post('/change-password', (req, res) => {
    const changePasswordForm = createChangePasswordForm();
    changePasswordForm.handle(req, {
        'error': (form) => {
            // console.log(form.data.currentPassword)
            // changePasswordForm.fields.currentPassword.value = form.data.currentPassword
            // form.fields.newPassword.value = form.data.newPassword
            // form.fields.newPassword2.value = form.data.newPassword2
            res.render('settings/change-password',{
                changePassword: true, // to control the tab selection
                changePasswordForm: form.toHTML(bootstrapField)
            })
        },
        'success': async(form) => {
            try{

                // use refresh token to obtain a new access token
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

                // use access token to send request to backend api to perform profile update
                let updatePasswordInfo = {
                    "current_password": form.data.currentPassword,
                    "new_password": form.data.newPassword
                }

                let headerAuthToken = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessTokenResult.data.accessToken}`
                }

                let changePasswordResult = await axios.put(`${apiUrl}/users/change-password`, updatePasswordInfo, {
                    headers: headerAuthToken
                })

                // check whether update is successful
                if (changePasswordResult) {

                    // password update successful
                    req.session.user.passwordExpired = false
                    req.flash('success_messages', "Password updated successfully");
                    res.redirect('/settings/profile');
                    
                } else {
                    req.flash('error_messages', "Change password failed due to unexpected error");
                    res.render('settings/change-password',{
                        changePassword: true, // to control the tab selection
                        changePasswordForm: form.toHTML(bootstrapField)
                    })
                }
            } catch(err) {
                req.flash('error_messages', "Change password failed due to unexpected error");
                res.render('settings/change-password',{
                    changePassword: true, // to control the tab selection
                    changePasswordForm: form.toHTML(bootstrapField)
                })
            }
        }
    });
})

module.exports = router; 