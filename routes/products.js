const express = require('express');
const router = express.Router();
const axios = require("axios");

// const { getProductById, getAllCategories, getAllTags } = require("");

const {
    bootstrapField,
    createProductForm,
    createSearchForm
} = require('../forms');
const productDataLayer = require("../dal/products");

router.get('/', async (req, res) => {
    await axios.get(`${apiUrl}/products`)
    .then(products => {
        res.render('products/listing', {
            productListing: true,
            products: products.data.data
        })
    })
})


// route to add a new product to the database
router.get('/add', async (req, res) => {
    const allCategories = await productDataLayer.getAllCategories();
    const allDesigners = await productDataLayer.getAllDesigners();
    const allInsurances = await productDataLayer.getAllInsurances();
    const allTags = await productDataLayer.getAllTags();
    const productForm = createProductForm(allCategories, allDesigners, allInsurances, allTags);
    res.render('products/add', {
        addNewProductListing: true,
        'productForm': productForm.toHTML(bootstrapField),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryUploadPreset': process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

// route to process new product submssion 
router.post('/add', async (req, res) => {
    const allCategories = await productDataLayer.getAllCategories();
    const allDesigners = await productDataLayer.getAllDesigners();
    const allInsurances = await productDataLayer.getAllInsurances();
    const allTags = await productDataLayer.getAllTags();
    const productForm = createProductForm(allCategories, allDesigners, allInsurances, allTags);
    productForm.handle(req, {
        'error': (form) => {
            // res.render('products/add', {
            //     form: true,
            //     'productForm': productForm.toHTML(bootstrapField),
            //     'cloudinaryName': process.env.CLOUDINARY_NAME,
            //     'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
            //     'cloudinaryUploadPreset': process.env.CLOUDINARY_UPLOAD_PRESET
            // })
        },
        'success:': async (form) => {
            try {
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
                let newProductInfo = {
                    "designer_id": form.data.designer_id,
                    "category_id": form.data.category_id,
                    "insurance_id": form.data.insurance_id,
                    "name": form.data.name,
                    "retail_price": form.data.retail_price,
                    "selling_price": form.data.selling_price,
                    "description": form.data.description,
                    "specifications": form.data.specifications,
                    "condition": form.data.condition,
                    "condition_description": form.data.condition_description,
                    "quantity": form.data.quantity,
                    "authenticity": form.data.authenticity,
                    "product_image_1": form.data.product_image_1,
                    "product_image_2": form.data.product_image_2,
                    "product_gallery_1": form.data.product_gallery_1,
                    "product_gallery_2": form.data.product_gallery_2,
                    "product_gallery_3": form.data.product_gallery_3,
                    "product_gallery_4": form.data.product_gallery_4,
                    "product_gallery_5": form.data.product_gallery_5,
                    "product_gallery_6": form.data.product_gallery_6,
                    "product_gallery_7": form.data.product_gallery_7,
                    "product_gallery_8": form.data.product_gallery_8,
                    "tags": form.data.tags
                }

                let headerAuthToken = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessTokenResult.data.accessToken}`
                }

                let createProductResult = await axios.put(`${apiUrl}/products/create`, newProductInfo, {
                    headers: headerAuthToken
                })

                // check whether create is successful
                if (createProductResult) {

                    // product creation successful

                    req.flash('success_messages', "Product created successfully");

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
                req.flash('error_messages', "Product creation failed due to unexpected error");
                // res.redirect('/settings/profile');
            }
        }
    })
})

module.exports = router; 