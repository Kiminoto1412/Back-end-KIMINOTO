module.exports = (sequelize, DataTypes) => {
    const BankAccount = sequelize.define(
      'BankAccount',
      {
        bankType: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        bankAccount: {
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
        
      },
  
      { underscored: true }
    );
    BankAccount.associate = (models) => {
      BankAccount.hasMany(models.Order, {
        foreignKey: {
          name: 'bankAccountId',
          allowNull: false,
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      
    };
  
    return BankAccount;
  };
  