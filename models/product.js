module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      productPic: {
        type: DataTypes.STRING(5000),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      sizeGuide: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      productDescription: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { underscored: true }
  );

  Product.associate = (models) => {
    // Product.hasMany(models.CartItem, {
    //   foreignKey: {
    //     name: "productId",
    //     allowNull: false,
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // });

    // Product.hasMany(models.OrderItem, {
    //   foreignKey: {
    //     name: "productId",
    //     allowNull: false,
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // });

    Product.hasMany(models.ProductOption, {
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    Product.belongsTo(models.ProductCategory, {
      foreignKey: {
        name: "productCategoryId",
        allowNull: false,
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    Product.belongsTo(models.ProductSubCategory, {
      foreignKey: {
        name: "productSubCategoryId",
        allowNull: false,
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return Product;
};
