module.exports = (sequelize, DataTypes) => {
  const ProductSubcategory = sequelize.define(
    "ProductSubcategory",
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
  // ProductSubcategory.associate = (models) => {
  //   ProductSubcategory.hasMany(models.Product, {
  //     foreignKey: {
  //       name: "productSubcategoryId",
  //       allowNull: false,
  //     },
  //     onUpdate: "CASCADE",
  //     onDelete: "CASCADE",
  //   });

  //   ProductSubcategory.belongsTo(models.ProductCategory, {
  //     foreignKey: {
  //       name: "productCategoryId",
  //       allowNull: false,
  //     },
  //     onUpdate: "CASCADE",
  //     onDelete: "CASCADE",
  //   });
  // };
  return ProductSubcategory;
};
