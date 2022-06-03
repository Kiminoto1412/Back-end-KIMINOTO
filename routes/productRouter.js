const express = require("express");
const productController = require("../controllers/Product/adminProductController");
const adminAuthenticate = require("../middlewares/adminAuthenticate");
// const postController = require("../controller/postController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post("/", adminAuthenticate,upload.fields([
    { name: "productPic", maxCount: 5 },
    {name:"sizeGuide",maxCount:1}
  ]),productController.createProduct);
// router.patch("/me", productController.changePassword);

// router.patch(
//   "/",
//   upload.fields([
//     { name: "productPic", maxCount: 1 },
//     { name: "coverPhoto", maxCount: 1 },
//   ]),
//   productController.updateProfile
// );

// router.get("/posts", postController.getAdminPost);

// router.get("/:adminId", productController.getAdminById); //ต้องไว้ล่างสุด เพราะถ้าไว้บน เกิดพิม /me /posts มันจะไม่เข้าอันที่ถูก

module.exports = router;