// var cloudinary = require("cloudinary").v2;
const fs = require("fs"); //libaryที่ใช้จัดการfile system มีอยู่ในnodeอยู่แล้ว
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
// const cloudinary = require("../utils/cloudinary");
const createError = require("../../utils/createError");
const { Customer, Friend } = require("../../models/");
const bcrypt = require("bcryptjs");

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.getMe = async (req, res, next) => {
  try {
    //   console.log(req.customer);

    // console.log(req.customer)
    // console.log(JSON.stringify(req.customer,null,2)) //ได้strออกมา แล้วเราก็parseให้ได้obj

    //ที่เพิ่งปิดไป
    // const customer = JSON.parse(JSON.stringify(req.customer));
    // console.log(customer);
    //ที่เพิ่งปิดไป

    //   const friends = await FriendService.findAcceptedFriend(req.customer.id);
    //   customer.friends = friends;
    res.json({ customer: req.customer ,admin:req.admin, role:req.role });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { id } = req.customer;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const customer = await Customer.findOne({
      where: { id: id },
    });

    const isMatch = await bcrypt.compare(oldPassword, customer.password);

    if(!isMatch){
      createError("Invalid old password", 400);
    }

    if (!newPassword) {
      //ถึงเราจะvalidateตรง modelsแล้ว แต่ต้องเช็ค newPasswordด้วยว่าเป็น empty str รึเปล่า เพราะมันจะhashedได้
      createError("new password is require", 400);
    }

    if (newPassword.length < 8) {
      createError("new password must be at least 8 charactor", 400);
    }

    if (newPassword !== confirmPassword) {
      createError("new password did not match", 400);
    }

    
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    customer.password = newHashedPassword;
    customer.save();

    const token = genToken({ id: customer.id });

    res.json({ message: "change password successful" , token });
  } catch (err) {
    next(err);
  }
};

exports.getcustomerById = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findOne({
      where: { id: customerId },
      attributes: { exclude: ["password"] },
    });
    console.log(customer);
    if (!customer) {
      createError("customer not found", 400);
    }
    const result = JSON.parse(JSON.stringify(customer));
    const friends = await FriendService.findAcceptedFriend(customer.id);
    result.friends = friends;

    //SELECT * FROM friends WHERE  (requestToId = customerId AND requestFromId = req.customer.Id) OR (requestToId = req.customer.id AND requestFromId = customerId)
    const friend = await Friend.findOne({
      where: {
        [Op.or]: [
          { requestToId: customer.id, requestFromId: req.customer.id },
          { requestToId: req.customer.id, requestFromId: customer.id },
        ],
      },
    });
    result.friendStatus = friend;
    res.json({ customer: result });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    // console.log(req.files)
    if (!req.files) {
      createError("ProfilePic or coverPhoto is req", 400);
    }
    const updateValue = {};

    if (req.files.profilePic) {
      const result = await cloudinary.upload(req.files.profilePic[0].path);
      if (req.customer.profilePic) {
        //ลบรูปเก่าถ้าเราเคยส่งรูปอะไรก็ตามไปแล้วมันจะไปทับแทน  'https://res.cloudinary.com/dnozjryud/image/upload/v1653447621/szeht6anspkoytngbwd8.jpg'
        const splited = req.customer.profilePic.split("/"); //req.customer มาจากtoken
        const publicId = splited[splited.length - 1].split(".")[0];
        await cloudinary.destroy(publicId);
      }
      updateValue.profilePic = result.secure_url;
    }
    if (req.files.coverPhoto) {
      const result = await cloudinary.upload(req.files.coverPhoto[0].path);
      updateValue.coverPhoto = result.secure_url;
    }
    if (req.customer.coverPhoto) {
      //ลบรูป
      const splited = req.customer.coverPhoto.split("/");
      const publicId = splited[splited.length - 1].split(".")[0];
      await cloudinary.destroy(publicId);
    }
    await Customer.update(updateValue, { where: { id: req.customer.id } });
    res.json({ ...updateValue });
    // if (!req.file) { //สำหรับการใช้ multerแบบ single

    // if (!req.files) {  //สำหรับการใช้ multerแบบ field ตอนนี้เราใช้แบบfieldแล้ว เพราะจะรับรูปได้หลายรูป
    //   createError("profilePic is required", 400);
    // }

    // const result = await cloudinary.upload(req.file.path);
    // await Customer.update(
    //   { profilePic: result.secure_url },
    //   { where: { id: req.customer.id } }
    // );
    // fs.unlinkSync(req.file.path); //ลบรูปที่upload เข้ามาในfolderเรา แต่ต้องทำหลังที่เราupload ขึ้น cloudeนะ

    // res.json({ profilePic: result.secure_url });
  } catch (err) {
    next(err);
  } finally {
    if (req.files.profilePic) {
      fs.unlinkSync(req.files.profilePic[0].path);
    }
    if (req.files.coverPhoto) {
      fs.unlinkSync(req.files.coverPhoto[0].path);
    }
  }
};

// console.log(req.file);
// cloudinary.uploader.upload(req.file.path, async (error, result) => {
//   if (error) {
//     return next(error);
//   }
//   await Customer.update(
//     { profilePic: result.secure_url},
//     { where: { id: req.customer.id } }
//   );
//     fs.unlinkSync(req.file.path)//ลบรูปที่upload เข้ามาในfolderเรา แต่ต้องทำหลังที่เราupload ขึ้น cloudeนะ

//   res.json({ profilePic: result.secure_url});
// });

// await Customer.update(
//     { profilePic: req.file.path },
//     { where: { id: req.customer.id } }
//   );
//   res.json({ profilePic: req.file.path });

// console.log(req.files) //หน้าตาแบบข้างล่าง
// [Object: null prototype] {
//   profilePic: [
//     {
//       fieldname: 'profilePic',
//       originalname: 'S__265494534.jpg',
//       encoding: '7bit',
//       mimetype: 'image/jpeg',
//       destination: 'public/images',
//       filename: '1653445922379.jpeg',
//       path: 'public\\images\\1653445922379.jpeg',
//       size: 263323
//     }
//       fieldname: 'coverPhoto',
//       originalname: 'instagram.png',
//       encoding: '7bit',
//       mimetype: 'image/png',
//       destination: 'public/images',
//       filename: '1653445922405.png',
//       path: 'public\\images\\1653445922405.png',
//       size: 24843
//     }
//   ]
// }
