const express = require("express");
const router = express.Router();
const upload = require('../middlewares/upload');

const paymentController = require("../controllers/payment/paymentController")

router.post('/', upload.single('image'), paymentController.makePayment);

//for admin can change status to 1.PURCHASED(slip ถูกต้อง) 2.SUCCESS(ส่งสำเร็จ)
router.patch('/:id', paymentController.editPaymentStatus);

module.exports = router;