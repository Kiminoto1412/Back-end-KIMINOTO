const {PENDING, SUCCESS } = require("../config/constrants");

module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define(
      'OrderItem',
      {
        quantity: {
          type: DataTypes.INTEGER,
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
        status: {
          type: DataTypes.ENUM(PENDING, SUCCESS),
          allowNull: false,
          defaultValue: PENDING,
          validate: {
            notEmpty: true,
          },
        },
  
      },
      { underscored: true }
    );
    OrderItem.associate = (models) => {
      // OrderItem.hasOne(models.Comment, {
      //   foreignKey: {
      //     name: 'orderItemId',
      //     allowNull: false,
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE',
      // });
  
      OrderItem.belongsTo(models.Order, {
        foreignKey: {
          name: 'orderId',
          allowNull: false,
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

      // OrderItem.belongsTo(models.Product, {
      //   foreignKey: {
      //     name: 'productId',
      //     allowNull: false,
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE',
      // });

      OrderItem.belongsTo(models.ProductOption, {
        foreignKey: {
          name: 'productOptionId',
          allowNull: false,
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    };
    return OrderItem;
  };
  