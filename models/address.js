module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    'Address',
    {
      addressName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      Address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      moreDetails: {
        type: DataTypes.STRING,
      },
    },
    { underscored: true }
  );
  // Address.associate = (models) => {
  //   Address.belongsTo(models.Customer, {
  //     foreignKey: {
  //       name: 'customerId',
  //       allowNull: false,
  //     },
  //     onUpdate: 'CASCADE',
  //     onDelete: 'CASCADE',
  //   });

    
  // };
  return Address;
};
