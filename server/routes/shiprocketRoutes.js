const express = require("express");
const { createShiprocketOrder, trackOrder } = require("../controllers/shiprocketController");
const router = express.Router();

router.post("/create-shiprocket-order", createShiprocketOrder);
router.get("/track-order/:orderId", trackOrder);

module.exports = router;
