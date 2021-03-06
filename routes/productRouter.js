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


router.patch("/:productId", adminAuthenticate,upload.fields([
    { name: "productPic", maxCount: 5 },
    {name:"sizeGuide",maxCount:1}
  ]),productController.updateProduct);
// router.patch("/me", productController.changePassword);

router.get("/:productId",productController.getProduct)

router.get("/",productController.getAllProduct)

router.get("/cat/:catId?" , productController.getCatProducts)
// router.get("/cat/:catId?/:subcatId?" , productController.getCatProducts)

router.delete("/:productId", adminAuthenticate , productController.deleteProduct)


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