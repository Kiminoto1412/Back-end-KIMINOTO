const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/admin/adminAuthController");
const customerAuthController = require("../controllers/customer/customerAuthController");
const upload = require("../middlewares/upload");

router.post("/customers/login", customerAuthController.login);
router.post(
  "/customers/signup",
  upload.fields([{ name: "profilePic", maxCount: 1 }]),
  customerAuthController.signup
);

router.post("/admins/login", adminAuthController.login);
router.post(
  "/admins/signup",
  upload.fields([{ name: "profilePic", maxCount: 1 }]),
  adminAuthController.signup
);


module.exports = router;
