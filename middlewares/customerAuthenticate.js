const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const { Customer } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
      createError("you are unauthorized", 401);
    }
    //แบบ1
    // const [,token] = authorization.split(' ')
    //แบบ2
    const token = authorization.split(" ")[1];
    if (!token) {
      createError("you are unauthorized", 401);
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const customer = await Customer.findOne({
      where: { id: payload.id },
      attributes: { exclude: ["password"] }, //ไม่ส่งpasswordไป
    });
    if (!customer) {
      createError("you are unauthorized", 401);
    }
    req.customer = customer;
    next();
  } catch (err) {
    next(err);
  }
};
