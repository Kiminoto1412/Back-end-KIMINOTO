const { productCategory, productSubCategory } = require("../models");

exports.getCategory = async (req, res, next) => {
  try {
    let categories = await productCategory.findAll();
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

exports.getSubCategory = async (req, res, next) => {
  try {
    let subcategories = await productSubCategory.findAll({
      where: { categoryId: req.params.subcatId },
    });
    res.json({ subcategories });
  } catch (err) {
    next(err);
  }
};
