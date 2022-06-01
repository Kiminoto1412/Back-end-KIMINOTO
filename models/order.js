module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      deliveryPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      paymentSlip: {
        type: DataTypes.STRING,
      },
      paymentDate: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM("INCART", "PENDING", "PURCHASED"),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },

    { underscored: true }
  );
  // Order.associate = (models) => {
  //   Order.hasMany(models.OrderItem, {
  //     foreignKey: {
  //       name: "orderId",
  //       allowNull: false,
  //     },
  //     onUpdate: "CASCADE",
  //     onDelete: "CASCADE",
  //   });

  //   Order.belongsTo(models.Customer, {
  //     foreignKey: {
  //       name: "customerId",
  //       allowNull: false,
  //     },
  //     onUpdate: "CASCADE",
  //     onDelete: "CASCADE",
  //   });

  //   Order.belongsTo(models.BankAccount, {
  //     foreignKey: {
  //       name: "bankAccountId",
  //       allowNull: false,
  //     },
  //     onUpdate: "CASCADE",
  //     onDelete: "CASCADE",
  //   });
  // };

  return Order;
};
