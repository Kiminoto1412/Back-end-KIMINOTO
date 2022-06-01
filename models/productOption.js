module.exports = (sequelize, DataTypes) => {
  const Productoption = sequelize.define(
    "Productoption",
    {
      color: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      size: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      storage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { underscored: true }
  );
  // Productoption.associate = (models) => {
  //   Productoption.belongsTo(models.OrderItem, {
  //     foreignKey: {
  //       name: "orderItemId",
  //       allowNull: false,
  //     },
  //     onUpdate: "CASCADE",
  //     onDelete: "CASCADE",
  //   });

  //   Productoption.belongsTo(models.Product, {
  //     foreignKey: {
  //       name: "productId",
  //       allowNull: false,
  //     },
  //     onUpdate: "CASCADE",
  //     onDelete: "CASCADE",
  //   });
  // };
  return Productoption;
};
