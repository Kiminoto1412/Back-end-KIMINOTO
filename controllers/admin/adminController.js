// var cloudinary = require("cloudinary").v2;
const fs = require("fs"); //libaryที่ใช้จัดการfile system มีอยู่ในnodeอยู่แล้ว
const { Op } = require("sequelize");
// const cloudinary = require("../utils/cloudinary");
const createError = require("../../utils/createError");
const { Admin } = require("../../models/");

exports.getMe = async (req, res,next) => {
    try{

        //   console.log(req.admin);
      
        // console.log(req.admin)
        // console.log(JSON.stringify(req.admin,null,2)) //ได้strออกมา แล้วเราก็parseให้ได้obj
        const admin = JSON.parse(JSON.stringify(req.admin));
        console.log(admin)
      //   const friends = await FriendService.findAcceptedFriend(req.admin.id);
      //   admin.friends = friends;
        res.json({ admin });
    }catch(err){
        next(err)
    }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { id } = req.admin;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const admin = await Admin.findOne({
      where: { id: id },
    });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);

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
    admin.password = newHashedPassword;
    admin.save();

    const token = genToken({ id: admin.id });

    res.json({ message: "change password successful" , token });
  } catch (err) {
    next(err);
  }
};

exports.getadminById = async (req, res, next) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findOne({
      where: { id: adminId },
      attributes: { exclude: ["password"] },
    });
    console.log(admin);
    if (!admin) {
      createError("admin not found", 400);
    }
    const result = JSON.parse(JSON.stringify(admin));
    const friends = await FriendService.findAcceptedFriend(admin.id);
    result.friends = friends;

    //SELECT * FROM friends WHERE  (requestToId = adminId AND requestFromId = req.admin.Id) OR (requestToId = req.admin.id AND requestFromId = adminId)
    const friend = await Friend.findOne({
      where: {
        [Op.or]: [
          { requestToId: admin.id, requestFromId: req.admin.id },
          { requestToId: req.admin.id, requestFromId: admin.id },
        ],
      },
    });
    result.friendStatus = friend;
    res.json({ admin: result });
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
      if (req.admin.profilePic) {
        //ลบรูปเก่าถ้าเราเคยส่งรูปอะไรก็ตามไปแล้วมันจะไปทับแทน  'https://res.cloudinary.com/dnozjryud/image/upload/v1653447621/szeht6anspkoytngbwd8.jpg'
        const splited = req.admin.profilePic.split("/"); //req.admin มาจากtoken
        const publicId = splited[splited.length - 1].split(".")[0];
        await cloudinary.destroy(publicId);
      }
      updateValue.profilePic = result.secure_url;
    }
    if (req.files.coverPhoto) {
      const result = await cloudinary.upload(req.files.coverPhoto[0].path);
      updateValue.coverPhoto = result.secure_url;
    }
    if (req.admin.coverPhoto) {
      //ลบรูป
      const splited = req.admin.coverPhoto.split("/");
      const publicId = splited[splited.length - 1].split(".")[0];
      await cloudinary.destroy(publicId);
    }
    await Admin.update(updateValue, { where: { id: req.admin.id } });
    res.json({ ...updateValue });
    // if (!req.file) { //สำหรับการใช้ multerแบบ single

    // if (!req.files) {  //สำหรับการใช้ multerแบบ field ตอนนี้เราใช้แบบfieldแล้ว เพราะจะรับรูปได้หลายรูป
    //   createError("profilePic is required", 400);
    // }

    // const result = await cloudinary.upload(req.file.path);
    // await admin.update(
    //   { profilePic: result.secure_url },
    //   { where: { id: req.admin.id } }
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
//   await admin.update(
//     { profilePic: result.secure_url},
//     { where: { id: req.admin.id } }
//   );
//     fs.unlinkSync(req.file.path)//ลบรูปที่upload เข้ามาในfolderเรา แต่ต้องทำหลังที่เราupload ขึ้น cloudeนะ

//   res.json({ profilePic: result.secure_url});
// });

// await admin.update(
//     { profilePic: req.file.path },
//     { where: { id: req.admin.id } }
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
