const express = require('express');
const router = express.Router();
const axios = require("axios");

const authServiceLayer = require("../services/authentication");

const {
    bootstrapField,
    createProductForm,
    createSearchForm
} = require('../forms');
const productDataLayer = require("../dal/products");

router.get('/', async (req, res) => {
    await productDataLayer.getAllProducts()
    .then(products => {
        res.render('products/listing', {
            productListing: true,
            products: products
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
            res.render('products/add', {
                addNewProductListing: true,
                'productForm': form.toHTML(bootstrapField),
                'cloudinaryName': process.env.CLOUDINARY_NAME,
                'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
                'cloudinaryUploadPreset': process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
        'success': async (form) => {
            try {
                // use refresh token to obtain a new access token
                let headers = await authServiceLayer.generateHttpAuthzJsonHeader(req.session.user.token);
                if (headers === null) {
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
                    "active": form.data.active,
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

                let createProductResult = await axios.post(`${apiUrl}/products/create`, newProductInfo, headers)

                // check whether create is successful
                if (createProductResult) {

                    // product creation successful
                    req.flash('success_messages', "Product created successfully");
                    res.redirect('/products');
                    
                } else {
                    req.flash('error_messages', "Product creation failed due to unexpected error");
                    res.render('products/add', {
                        addNewProductListing: true,
                        'productForm': form.toHTML(bootstrapField),
                        'cloudinaryName': process.env.CLOUDINARY_NAME,
                        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
                        'cloudinaryUploadPreset': process.env.CLOUDINARY_UPLOAD_PRESET
                    })
                }
            } catch(err) {
                console.log("Product creation failed. ", err)
                req.flash('error_messages', "Product creation failed due to unexpected error");
                res.render('products/add', {
                    addNewProductListing: true,
                    'productForm': form.toHTML(bootstrapField),
                    'cloudinaryName': process.env.CLOUDINARY_NAME,
                    'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
                    'cloudinaryUploadPreset': process.env.CLOUDINARY_UPLOAD_PRESET
                })
            }
        }
    })
})

router.get('/:product_id/update', async (req, res) => {
    // retrieve the product
    const productId = req.params.product_id;
    await productDataLayer.getProductById(productId)
    .then( async (product) => {
        const allCategories = await productDataLayer.getAllCategories();
        const allDesigners = await productDataLayer.getAllDesigners();
        const allInsurances = await productDataLayer.getAllInsurances();
        const allTags = await productDataLayer.getAllTags();
        const productForm = createProductForm(allCategories, allDesigners, allInsurances, allTags);

        productForm.fields.name.value = product['name'];
        productForm.fields.designer_id.value = product['designer_id'];
        productForm.fields.category_id.value = product['category_id'];
        productForm.fields.insurance_id.value = product['insurance_id'];
        productForm.fields.retail_price.value = product['retail_price'];
        productForm.fields.selling_price.value = product['selling_price'];
        productForm.fields.description.value = product['description'];
        productForm.fields.specifications.value = product['specifications'];
        productForm.fields.condition.value = product['condition'];
        productForm.fields.condition_description.value = product['condition_description'];
        productForm.fields.quantity.value = product['quantity'];
        productForm.fields.authenticity.value = [ product['authenticity'] ];
        productForm.fields.active.value = [ product['active'] ];
        productForm.fields.product_image_1.value = product['product_image_1'];
        productForm.fields.product_image_2.value = product['product_image_2'];
        productForm.fields.product_gallery_1.value = product['product_gallery_1'];
        productForm.fields.product_gallery_2.value = product['product_gallery_2'];
        productForm.fields.product_gallery_3.value = product['product_gallery_3'];
        productForm.fields.product_gallery_4.value = product['product_gallery_4'];
        productForm.fields.product_gallery_5.value = product['product_gallery_5'];
        productForm.fields.product_gallery_6.value = product['product_gallery_6'];
        productForm.fields.product_gallery_7.value = product['product_gallery_7'];
        productForm.fields.product_gallery_8.value = product['product_gallery_8'];
        let selectTags = product['tags'].map(tag => tag.id)
        productForm.fields.tags.value = selectTags;

        res.render('products/update', {
            'editProduct': true,
            'product': product,
            'productForm': productForm.toHTML(bootstrapField),
            'cloudinaryName': process.env.CLOUDINARY_NAME,
            'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
            'cloudinaryUploadPreset': process.env.CLOUDINARY_UPLOAD_PRESET
        })
    });

    
})

// route to process update product submssion 
router.post('/:product_id/update', async (req, res) => {
    const productId = req.params.product_id;

    await axios.get(`${apiUrl}/products/${productId}`)
    .then( async (productResult) => {
        let product = productResult.data.data;

        const allCategories = await productDataLayer.getAllCategories();
        const allDesigners = await productDataLayer.getAllDesigners();
        const allInsurances = await productDataLayer.getAllInsurances();
        const allTags = await productDataLayer.getAllTags();
        const productForm = createProductForm(allCategories, allDesigners, allInsurances, allTags);

        productForm.handle(req, {
            'error': (form) => {
                res.render('products/update', {
                    'editProduct': true,
                    'product': product,
                    'productForm': form.toHTML(bootstrapField),
                    'cloudinaryName': process.env.CLOUDINARY_NAME,
                    'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
                    'cloudinaryUploadPreset': process.env.CLOUDINARY_UPLOAD_PRESET
                })
            },
            'success': async (form) => {
                try {
                    // use refresh token to obtain a new access token
                    let headers = await authServiceLayer.generateHttpAuthzJsonHeader(req.session.user.token);
                    if (headers === null) {
                        req.flash('error_messages', 'Login session expired')
                        res.redirect('/login')
                    }

                    // use access token to send request to backend api to perform profile update
                    let updatedProductInfo = {
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

                    let updateProductResult = await axios.put(`${apiUrl}/products/${productId}/update`, updatedProductInfo, headers)

                    // check whether create is successful
                    if (updateProductResult) {

                        // product creation successful
                        req.flash('success_messages', `Product # ${productId} updated successfully`);
                        res.redirect('/products');
                        
                    } else {
                        req.flash('error_messages', "Product update failed due to unexpected error");
                        res.render('products/update', {
                            'editProduct': true,
                            'product': product,
                            'productForm': form.toHTML(bootstrapField),
                            'cloudinaryName': process.env.CLOUDINARY_NAME,
                            'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
                            'cloudinaryUploadPreset': process.env.CLOUDINARY_UPLOAD_PRESET
                        })
                    }
                } catch(err) {
                    console.log("Product update failed. ", err)
                    req.flash('error_messages', "Product update failed due to unexpected error");
                    res.render('products/update', {
                        'editProduct': true,
                        'product': product,
                        'productForm': form.toHTML(bootstrapField),
                        'cloudinaryName': process.env.CLOUDINARY_NAME,
                        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
                        'cloudinaryUploadPreset': process.env.CLOUDINARY_UPLOAD_PRESET
                    })
                }
            }
        })
    })
    
})

// route to process to activate existing product 
router.get('/:product_id/activate', async function (req, res) {
    const productId = req.params.product_id
    try {
        const headers = await authServiceLayer.generateHttpAuthzJsonHeader(req.session.user.token);
        if (headers === null) {
            req.flash('error_messages', 'Login session expired')
            res.redirect('/login')
        }

        const newProductInfo = {
            "active": true
        }

        await axios.put(`${apiUrl}/products/${productId}/update`, newProductInfo, headers)
        req.flash('success_messages', `Product id ${productId} activated successfully`);
        res.redirect('back');
        
    } catch(_err) {
        req.flash('error_messages', `Unable to activate product id ${productId}`)
        res.redirect('back');
    }
})

// route to process to activate existing product 
router.get('/:product_id/deactivate', async function (req, res) {
    const productId = req.params.product_id
    try {
        const headers = await authServiceLayer.generateHttpAuthzJsonHeader(req.session.user.token);
        if (headers === null) {
            req.flash('error_messages', 'Login session expired')
            res.redirect('/login')
        }

        const newProductInfo = {
            "active": false
        }

        await axios.put(`${apiUrl}/products/${productId}/update`, newProductInfo, headers)
        req.flash('success_messages', `Product id ${productId} deactivated successfully`);
        res.redirect('back');
        
    } catch(_err) {
        req.flash('error_messages', `Unable to deactivate product id ${productId}`)
        res.redirect('back');
    }
})

module.exports = router; 