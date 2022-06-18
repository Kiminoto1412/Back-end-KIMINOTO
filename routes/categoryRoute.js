const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/Category/categoriesController");
const customerAuthenticate = require("../middlewares/customerAuthenticate");
const upload = require("../middlewares/upload");

// ?ใส่นี้ต่อคือ ไม่ต้องใส่idก็ได้ มันจะเอามาหมดเลย
router.get('/:id?', categoryController.getCategory);
router.get('/:subcatId', categoryController.getSubcategory);

module.exports = router;