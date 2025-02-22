// /server/routes/geoRoutes.js
const express = require('express');
const { saveAddress } = require('../controllers/geoController');
const router = express.Router();

router.post('/save-address', saveAddress); // POST endpoint to save address

module.exports = router;
