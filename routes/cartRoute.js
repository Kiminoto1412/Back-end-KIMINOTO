const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart/cartController")

//create and update
router.post('/', cartController.addCartItem);

router.get('/', cartController.getCartItems);
router.patch('/', cartController.changeQuantity);

router.delete('/:id', cartController.deleteCartItem);

module.exports = router;