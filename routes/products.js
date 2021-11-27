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
router.get('/add', async (req, res) => {   // to remove -- replace with router.get('/add', async function (req, res) {}
    // const allCategories = await getAllCategories();
    // const allTags = await getAllTags(); 
    const allCategories = await productDataLayer.getAllCategories();
    const allDesigners = await productDataLayer.getAllDesigners();
    const allInsurances = await productDataLayer.getAllInsurances();
    const allTags = await productDataLayer.getAllTags();
    const productForm = createProductForm(allCategories, allDesigners, allInsurances, allTags);   // to add in parameter - allCategories, allTags
    res.render('products/add', {
        addNewProductListing: true,
        'productForm': productForm.toHTML(bootstrapField)
        // 'productForm': productForm.toHTML(bootstrapField),
        // 'cloudinaryName': process.env.CLOUDINARY_NAME,
        // 'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        // 'cloudinaryUploadPreset': process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

// route to process new product submssion 
// router.post('/add', async function (req, res) {})

module.exports = router; 