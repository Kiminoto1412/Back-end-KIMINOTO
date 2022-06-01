module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define(
    "ProductCategory",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { underscored: true }
  );
  // ProductCategory.associate = (models) => {
  //   ProductCategory.hasMany(models.Product, {
  //     foreignKey: {
  //       name: "productCategoryId",
  //       allowNull: false,
  //     },
  //     onUpdate: "CASCADE",
  //     onDelete: "CASCADE",
  //   });

  //   ProductCategory.hasMany(models.ProductSubCategory, {
  //     foreignKey: {
  //       name: "productCategoryId",
  //       allowNull: false,
  //     },
  //     onUpdate: "CASCADE",
  //     onDelete: "CASCADE",
  //   });
  // };
  return ProductCategory;
};
