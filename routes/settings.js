const express = require('express');
const router = express.Router();
const { bootstrapField } = require('../forms');
const crypto = require('crypto');
// const { checkIfAuthenticated} = require('../middlewares');


const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

// router.get('/settings', [checkIfAuthenticated], (req,res)=>{})  --> to use htis instead
router.get('/',(req,res)=>{
    res.render('settings/profile',{
        // 'user': req.session.user
    })
})

// route to process to update existing user admin details
router.post('/:user_id/update', async function (req, res) {})

module.exports = router; 