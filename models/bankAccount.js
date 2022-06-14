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
        bankName: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        
      },
  
      { underscored: true }
    );
    // BankAccount.associate = (models) => {
    //   ankAccount.hasMany(models.Order, {
    //     foreignKey: {
    //       name: 'bankAccountId',
    //       allowNull: false,
    //     },
    //     onUpdate: 'CASCADE',
    //     onDelete: 'CASCADE',
    //   });B
      
    // };
  
    return BankAccount;
  };
  