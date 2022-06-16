const { BankAccount } = require("../../models");
const createError = require("../../middlewares/error");

exports.getBankAccount = async (req, res, next) => {
  try {
      const bankAccount = await BankAccount.findAll();
      res.json({ bankAccount });
  } catch (err) {
    next(err);
  }
};
