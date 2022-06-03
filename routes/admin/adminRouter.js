const express = require("express");
const adminController = require("../../controllers/customer/adminAuthController");
// const postController = require("../controller/postController");
// const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/me", adminController.getMe);
router.patch("/me", adminController.changePassword);

// router.patch(
//   "/",
//   upload.fields([
//     { name: "profilePic", maxCount: 1 },
//     { name: "coverPhoto", maxCount: 1 },
//   ]),
//   adminController.updateProfile
// );

// router.get("/posts", postController.getAdminPost);

// router.get("/:adminId", adminController.getAdminById); //ต้องไว้ล่างสุด เพราะถ้าไว้บน เกิดพิม /me /posts มันจะไม่เข้าอันที่ถูก

module.exports = router;
