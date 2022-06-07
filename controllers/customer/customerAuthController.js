const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const createError = require("../../utils/createError");
const validator = require("validator"); //npm i validator มาใช้ เช็ค email
const { Customer } = require("../../models");
const cloudinary = require("../../utils/cloudinary");
const fs = require("fs"); //libaryที่ใช้จัดการfile system มีอยู่ในnodeอยู่แล้ว

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({
      where: { email: email },
    });

    if (!customer) {
      createError("invalid credential", 400);
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      createError("invalid credential", 400);
    }

    const token = genToken({ id: customer.id });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    console.log(req.files)
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      addressName,
      address,
      city,
      district,
      postalCode,
      moreDetails,
    } = req.body;
    // console.log(req.body)

    // const customerPic = {};

    // if (req.files?.profilePic) {
    //   const result = await cloudinary.upload(req.files.profilePic[0].path);
    //   // console.log(req.customer.profilePic)
    //   if (req.customer?.profilePic) {
    //     //ลบรูปเก่าถ้าเราเคยส่งรูปอะไรก็ตามไปแล้วมันจะไปทับแทน  'https://res.cloudinary.com/dnozjryud/image/upload/v1653447621/szeht6anspkoytngbwd8.jpg'
    //     const splited = req.customer.profilePic.split("/"); //req.customer มาจากtoken
    //     const publicId = splited[splited.length - 1].split(".")[0];
    //     await cloudinary.destroy(publicId);
    //   }
    //   customerPic.profilePic = result.secure_url;
    // }
    let imageUrl={};
    if (req.file) {
      const result = await cloudinary.upload(req.files.profilePic[0].path);
      imageUrl.customerPic = result.secure_url;
    }
    console.log(req.files)

    const isMobilePhone = validator.isMobilePhone(phoneNumber + "");
    // console.log(isMobilePhone)
    const isEmail = validator.isEmail(email + "");
    // console.log(isEmail)

    if (!email) {
      createError("email is required", 400);
    }
    if (!phoneNumber) {
      createError("phone number is required", 400);
    }
    if (!password) {
      //ถึงเราจะvalidateตรง modelsแล้ว แต่ต้องเช็ค passwordด้วยว่าเป็น empty str รึเปล่า เพราะมันจะhashedได้
      createError("password is require", 400);
    }

    if (password.length < 8) {
      createError("password must be at least 8 charactor", 400);
    }

    if (password !== confirmPassword) {
      createError("password did not match", 400);
    }
    if (!addressName) {
      createError("address name is required", 400);
    }
    if (!address) {
      createError("address is required", 400);
    }
    if (!city) {
      createError("city is required", 400);
    }
    if (!district) {
      createError("district is required", 400);
    }
    if (!postalCode) {
      createError("postal code is required", 400);
    }
    if (!moreDetails) {
      createError("more details are required", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      addressName,
      address,
      city,
      district,
      postalCode,
      moreDetails,
      profilePic: imageUrl.profilePic,
    });

    const token = genToken({ id: customer.id });

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  } finally {
    if (req.files?.profilePic) {
      fs.unlinkSync(req.files.profilePic[0].path);
    }
  }
};

