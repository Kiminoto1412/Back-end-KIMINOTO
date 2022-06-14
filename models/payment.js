module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      paymentSlip: {
        type: DataTypes.STRING,
      },

      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "PENDING",
        validate: {
          notEmpty: true,
        },
      },
    },

    { underscored: true }
  );
  Payment.associate = (models) => {
    Payment.belongsTo(models.Order, {
      foreignKey: {
        name: "orderId",
        allowNull: false,
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };

  return Payment;
};
