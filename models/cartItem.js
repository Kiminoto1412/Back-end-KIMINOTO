module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define(
      'CartItem',
      {
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
  
      },
      { underscored: true }
    );
    CartItem.associate = (models) => {
        CartItem.belongsTo(models.ProductOption, {
        foreignKey: {
          name: 'productOptionId',
          allowNull: false,
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

      //   CartItem.belongsTo(models.Product, {
      //   foreignKey: {
      //     name: 'productId',
      //     allowNull: false,
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE',
      // });

        CartItem.belongsTo(models.Customer, {
        foreignKey: {
          name: 'customerId',
          allowNull: false,
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
  
     
    };
    return CartItem;
  };
  