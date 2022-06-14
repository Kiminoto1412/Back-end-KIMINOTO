
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
     
      // status: {
      //   type: DataTypes.ENUM(IN_CART, PENDING, SUCCESS),
      //   allowNull: false,
      //   defaultValue: IN_CART,
      //   validate: {
      //     notEmpty: true,
      //   },
      // },
    },

    { underscored: true }
  );
  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, {
      foreignKey: {
        name: "orderId",
        allowNull: false,
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    Order.belongsTo(models.Customer, {
      foreignKey: {
        name: "customerId",
        allowNull: false,
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Order.belongsTo(models.BankAccount, {
    //   foreignKey: {
    //     name: "bankAccountId",
    //     allowNull: false,
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // });

    Order.hasOne(models.Payment, {
      foreignKey: {
        name: "orderId",
        allowNull: false,
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };

  return Order;
};
