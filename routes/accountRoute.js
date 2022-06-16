const express = require("express");
const bankAccountController = require("../controllers/bankaccount/bankAccountController");

const router = express.Router();

router.get("/", bankAccountController.getBankAccount);
// router.patch("/", adminController.changePassword);


module.exports = router;
