const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const { Customer , Admin } = require("../models");

module.exports = async (req, res, next) => {
  try {
    let customer;
    let admin;


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

    // console.log(payload)
    if(payload.role === "customer"){

       customer = await Customer.findOne({
        where: { id: payload.id },
        attributes: { exclude: ["password"] }, //ไม่ส่งpasswordไป
      });
      req.customer = customer;
      // console.log(req.customer)
      req.role = "customer";
    }
      
    if(payload.role === "admin"){
     admin = await Admin.findOne({
      where: { id: payload.id },
      attributes: { exclude: ["password"] }, //ไม่ส่งpasswordไป
    });

    req.admin = admin;
      req.role = "admin";
  }

    if (!admin && !customer) {
      createError("you are unauthorized", 401);
    }
    // if (admin) {
    //   req.admin = admin;
    //   req.role = "admin";
    // } else if (customer) {
    //   req.customer = customer;
    //   // console.log(req.customer)
    //   req.role = "customer";
    // }

    next();
  } catch (err) {
    next(err);
  }
};
