module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
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
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        // defaultValue : 0,
        validate: {
          isEmail: true,
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      profilePic: DataTypes.STRING,
      coverPhoto: DataTypes.STRING,
    },

    { underscored: true }
  );
  Customer.associate = (models) => {
    Customer.hasMany(models.Order, {
      foreignKey: {
        name: 'customerId',
        allowNull: false,
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    Customer.hasMany(models.Comment, {
      foreignKey: {
        name: 'customerId',
        allowNull: false,
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    Customer.hasMany(models.Address, {
      foreignKey: {
        name: 'customerId',
        allowNull: false,
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    
  };

  return Customer;
};
