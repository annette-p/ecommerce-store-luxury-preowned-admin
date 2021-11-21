const express = require('express');
const router = express.Router();
const { bootstrapField, createChangePasswordForm, displayAdminProfileForm } = require('../forms');
const crypto = require('crypto');
// const { checkIfAuthenticated} = require('../middlewares');


const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

// router.get('/settings', [checkIfAuthenticated], (req,res)=>{})  --> to use htis instead
router.get('/',(req,res)=>{
    // const changePasswordForm = createChangePasswordForm();
    const adminProfileForm = displayAdminProfileForm();

    // call api to get profile info
    adminProfileForm.fields.firstname.value = "John";
    adminProfileForm.fields.lastname.value = "D";
    adminProfileForm.fields.email.value = "abc@gmail.com";

    res.render('settings/profile',{
        // 'user': req.session.user
        updateMyProfile: true, // to control the tab selection
        adminProfileForm: adminProfileForm.toHTML(bootstrapField)
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

// route to process to update existing user admin details
router.post('/:user_id/update', async function (req, res) {})

module.exports = router; 