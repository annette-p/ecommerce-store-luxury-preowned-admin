const express = require('express');
const router = express.Router();
const axios = require("axios");

const authServiceLayer = require("../services/authentication");

const {
    bootstrapField,
    createChangePasswordForm,
    displayAdminProfileForm
} = require('../forms');

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

                let headers = await authServiceLayer.generateHttpAuthzJsonHeader(req.session.user.token);
                if (headers === null) {
                    req.flash('error_messages', 'Login session expired')
                    res.redirect('/login')
                }

                // use access token to send request to backend api to perform profile update
                let newProfileInfo = {
                    "firstname": form.data.firstname,
                    "lastname": form.data.lastname,
                    "email": form.data.email
                }

                let updateAdminResult = await axios.put(`${apiUrl}/users/update`, newProfileInfo, headers);

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

                        await axios.get(`${apiUrl}/users/info`, headers)
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
            res.render('settings/change-password',{
                changePassword: true, // to control the tab selection
                changePasswordForm: form.toHTML(bootstrapField)
            })
        },
        'success': async(form) => {
            try{

                let headers = await authServiceLayer.generateHttpAuthzJsonHeader(req.session.user.token);

                if (headers === null) {
                    req.flash('error_messages', 'Login session expired')
                    res.redirect('/login')
                }

                // use access token to send request to backend api to perform profile update
                let updatePasswordInfo = {
                    "current_password": form.data.currentPassword,
                    "new_password": form.data.newPassword
                }

                await axios.put(`${apiUrl}/users/change-password`, updatePasswordInfo, headers)
                .then(() => {
                    // password update successful
                    req.session.user.passwordExpired = false
                    req.flash('success_messages', "Password updated successfully");
                    res.redirect('/settings/profile');
                }).catch(err => {
                    if (err.response.status === 401) {
                        req.flash('error_messages', "Current password is incorrect");
                        res.redirect('/settings/change-password');
                    } else {
                        req.flash('error_messages', "Change password failed due to unexpected error");
                        res.redirect('/settings/change-password');
                    }
                })

            } catch(err) {
                req.flash('error_messages', "Change password failed due to unexpected error");
                res.redirect('/settings/change-password');
            }
        }
    });
})

module.exports = router; 