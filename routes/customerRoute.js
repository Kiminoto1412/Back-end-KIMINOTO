const express = require("express");
const customerController = require("../controllers/customer/customerController");
// const postController = require("../controller/postController");
// const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/me", customerController.getMe);
router.patch("/me", customerController.changePassword);

// router.patch(
//   "/",
//   upload.fields([
//     { name: "profilePic", maxCount: 1 },
//     { name: "coverPhoto", maxCount: 1 },
//   ]),
//   customerController.updateProfile
// );

// router.get("/posts", postController.getUserPost);

// router.get("/:userId", customerController.getUserById); //ต้องไว้ล่างสุด เพราะถ้าไว้บน เกิดพิม /me /posts มันจะไม่เข้าอันที่ถูก

module.exports = router;
