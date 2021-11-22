const express = require('express');
const router = express.Router();

// const { getProductById, getAllCategories, getAllTags } = require("");

const {
    bootstrapField,
    createProductForm,
    createSearchForm
} = require('../forms');

router.get('/', (req, res) => {
    res.render('products/listing', {
        productListing: true
    })
})


// route to add a new product to the database
router.get('/add', (req, res) => {   // to remove -- replace with router.get('/add', async function (req, res) {}
    // const allCategories = await getAllCategories();
    // const allTags = await getAllTags(); 
    const allCategories = [
        {"XX": "YY"}
    ]
    const allTags = [ '1', '2']
    const productForm = createProductForm();   // to add in parameter - allCategories, allTags
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