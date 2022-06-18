const { ProductCategory, ProductSubcategory } = require("../../models");
const cloudinary = require("../../utils/cloudinary");
const fs = require("fs");


exports.getCategory = async (req, res, next) => {
  try {
    let categories;
    if (req.params.id) {
      categories = await ProductCategory.findOne({
        where: { id: req.params.id },
      });
    } else if (!req.params.id) {
      categories = await ProductCategory.findAll();
    }

    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

exports.getSubcategory = async (req, res, next) => {
  try {
    let subcategories = await ProductSubcategory.findAll({
      where: { categoryId: req.params.subcatId },
    });
    res.json({ subcategories });
  } catch (err) {
    next(err);
  }
};