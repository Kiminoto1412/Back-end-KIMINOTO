module.exports = (sequelize, DataTypes) => {
  const ProductSubCategory = sequelize.define(
    "ProductSubCategory",
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
  ProductSubCategory.associate = (models) => {
    ProductSubCategory.hasMany(models.Product, {
      foreignKey: {
        name: "ProductSubCategoryId",
        allowNull: false,
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    ProductSubCategory.belongsTo(models.ProductCategory, {
      foreignKey: {
        name: "productCategoryId",
        allowNull: false,
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return ProductSubCategory;
};
