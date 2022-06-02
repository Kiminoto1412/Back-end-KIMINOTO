module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {  //config message error ของvalidate
            msg : 'title must not be empty'
          },
        },
      },

      commentPic: {
        type: DataTypes.STRING,
      },
    },
    { underscored: true }
  );
  Comment.associate = (models) => {
    Comment.belongsTo(models.Customer, {
      foreignKey: {
        name: "customerId",
        allowNull: false,
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    Comment.belongsTo(models.OrderItem, {
      foreignKey: {
        name: "commentId",
        allowNull: false,
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return Comment;
};
