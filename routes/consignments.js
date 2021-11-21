const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('consignments/listing', {})
})

// route to process to update consignment order processing (rejected, pending official evaluation, accepted, on listing)
router.post('/:consignment_id/update', async function (req, res) {})

module.exports = router; 