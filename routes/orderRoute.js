const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order/orderControllers");


router.post("/", orderController.submitOrder);
router.get("/", orderController.getCustomerOrders);

// ต้องเป็น adminเท่านั้นด้วย
router.get("/all", orderController.getAllOrders);

module.exports = router;

