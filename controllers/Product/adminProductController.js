const { Product, ProductOption, sequelize } = require("../../models");
const fs = require("fs");
const createError = require("../../utils/createError");
const cloudinary = require("../../utils/cloudinary");

exports.getProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    console.log(productId)
    const product = await Product.findAll({
      where: { id: productId },
      include: ProductOption,
    });
    console.log(product);
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

exports.getAllProduct = async (req, res, next) => {
  try {
    const product = await Product.findAll();
    console.log(product);
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    //หน้าตาของ
    // const product = {
    //   name: "shirt",
    //   price: 250,
    //   productPic: "https://",
    //   sizeGuide: "https://",
    //   productDescription: "...",
    //   stock: [
    //     { size: "s", color: "green", quantity: 10 },
    //     { size: "s", color: "red", quantity: 5 },
    //   ],
    // };

    //ไว้ใส่ value ของ stock
    // "[
    //   { "size": "s", "color": "green", "quantity": "10" },
    //    { "size": "s", "color": "red", "quantity": "5" },
    //  ]"

    // console.log(req.files);
    const {
      name,
      price,
      productDescription,
      productCategoryId,
      productSubCategoryId,
      stock,
    } = req.body;

    const stockProductPic = {};

    if (req.files?.productPic) {
      for (let pic of req.files?.productPic) {
        const result = await cloudinary.upload(pic.path);
        // console.log(req.product.productPic)
        // if (req.product?.productPic) {
        //   //ลบรูปเก่าถ้าเราเคยส่งรูปอะไรก็ตามไปแล้วมันจะไปทับแทน  'https://res.cloudinary.com/dnozjryud/image/upload/v1653447621/szeht6anspkoytngbwd8.jpg'
        //   const splited = req.product.productPic.split("/"); //req.product มาจากtoken
        //   const publicId = splited[splited.length - 1].split(".")[0];
        //   await cloudinary.destroy(publicId);
        // }

        if (stockProductPic.productPic) {
          stockProductPic.productPic = [
            ...stockProductPic.productPic,
            result.secure_url,
          ];
        } else {
          stockProductPic.productPic = [result.secure_url];
        }
      }
    }
    if (req.files.sizeGuide) {
      const result = await cloudinary.upload(req.files.sizeGuide[0].path);
      stockProductPic.sizeGuide = result.secure_url;
    }
    // if (req.product.sizeGuide) {
    //   //ลบรูป
    //   const splited = req.product.sizeGuide.split("/");
    //   const publicId = splited[splited.length - 1].split(".")[0];
    //   await cloudinary.destroy(publicId);
    // }

    // console.log(stockProductPic)

    const stockArray = JSON.parse(stock);
    // console.log(stockArray);

    //validate
    // if (!title && !req.file) {
    //   createError("title or image is required", 400);
    // }
    // let image;
    // if (req.file) {
    //   const result = await cloudinary.upload(req.file.path);
    //   image = result.secure_url;
    // }

    //Create Table Product
    const product = await Product.create(
      {
        name,
        price,
        // productPic: stockProductPic.productPic,
        productPic: JSON.stringify(stockProductPic.productPic),
        sizeGuide: stockProductPic.sizeGuide,
        productCategoryId,
        productSubCategoryId,
        productDescription,
      },
      { transaction: t }
    );

    // Modified Stock Obj
    const { id } = product;
    const newStock = stockArray.map((obj) => {
      obj.productId = id;
      return obj;
    });
    // console.log(newStock)

    /*  
      newStock : [
        {size:"s",color:"green",quantity:10,product_id : 5},
        {size:"s",color:"red",quantity:5,product_id : 5},
        ]
    */

    //Create Table ProductOption
    // console.log(newStock)
    const productOption = await ProductOption.bulkCreate(newStock, {
      transaction: t,
    });

    await t.commit();
    res.json({ product });
  } catch (err) {
    await t.rollback();
    next(err);
  } finally {
    // console.log(req.files);
    // if (req.files.productPic) {
    //   req.files.productPic.forEach((e) => {
    //     fs.unlinkSync(e.path);
    //   });
    // }
    if (req.files.productPic) {
      for (let pic of req.files?.productPic) {
        fs.unlinkSync(pic.path);
      }
    }
    if (req.files.sizeGuide) {
      fs.unlinkSync(req.files.sizeGuide[0].path);
    }
  }
};

exports.updateProduct = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    // console.log(req.files);
    const { productId } = req.params;
    const {
      name,
      price,
      productDescription,
      productCategoryId,
      productSubCategoryId,
      stock,
    } = req.body;

    const stockProductPic = {};

    if (req.files?.productPic) {
      const result = await cloudinary.upload(req.files.productPic[0].path);
      // console.log(req.product.productPic)
      if (req.product?.productPic) {
        //ลบรูปเก่าถ้าเราเคยส่งรูปอะไรก็ตามไปแล้วมันจะไปทับแทน  'https://res.cloudinary.com/dnozjryud/image/upload/v1653447621/szeht6anspkoytngbwd8.jpg'
        const splited = req.product.productPic.split("/"); //req.product มาจากtoken
        const publicId = splited[splited.length - 1].split(".")[0];
        await cloudinary.destroy(publicId);
      }
      stockProductPic.productPic = result.secure_url;
    }
    if (req.files.sizeGuide) {
      const result = await cloudinary.upload(req.files.sizeGuide[0].path);
      stockProductPic.sizeGuide = result.secure_url;
    }
    // console.log(req.product.sizeGuide)
    // if (req.product.sizeGuide) {
    //   //ลบรูป
    //   const splited = req.product.sizeGuide.split("/");
    //   const publicId = splited[splited.length - 1].split(".")[0];
    //   await cloudinary.destroy(publicId);
    // }

    // console.log(stock)
    const stockArray = JSON.parse(stock);
    console.log(stockArray);

    //Update Table Product
    const product = await Product.update(
      {
        name,
        price,
        productPic: stockProductPic.productPic,
        sizeGuide: stockProductPic.sizeGuide,
        productCategoryId,
        productSubCategoryId,
        productDescription,
      },
      { where: { id: productId } },
      { transaction: t }
    );

    // const productOption = await ProductOption.bulkCreate(newStock, {
    //   transaction: t,
    // });

    // // Update ทีละproductOptionId
    // const newStock = stockArray.forEach(obj => {
    //   await ProductOption.update(
    //     obj,
    //     { where: { id:obj.id} },
    //     {
    //       transaction: t,
    //     }
    //   );
    // });

    // Update ทีละproductOptionId
    // const newStock = stockArray.forEach(async (obj) => {
    //   //ถ้าในobjมีid จะ .idได้ ให้findOneต่อ และ update
    // if (obj.id) {
    //   const p = await ProductOption.findOne({ where: { id: obj.id } });

    //   await ProductOption.update(
    //     obj,
    //     { where: { id: obj.id } },
    //     {
    //       transaction: t,
    //     }
    //   );
    //   } //ถ้ายังไม่เคยมีobj.id === productOptionId แสดงว่าให้createมา
    //   else {
    //     console.log({ ...obj, productId });
    //     // console.log(productId)
    //     await ProductOption.create(
    //       { ...obj, productId },
    //       {
    //         transaction: t,
    //       }
    //     );
    //   }
    // });

    for (obj of stockArray) {
      console.log(obj.id);
      if (obj.id) {
        const p = await ProductOption.findOne({ where: { id: obj.id } });
        if (!p) {
          createError("product option not found");
        }
        await ProductOption.update(
          obj,
          { where: { id: obj.id } },
          {
            transaction: t,
          }
        );
      } else {
        await ProductOption.create(
          { ...obj, productId },
          {
            transaction: t,
          }
        );
      }
    }

    const updateProduct = await Product.findOne({
      where: { id: productId },
      include: ProductOption,
    });

    await t.commit();
    console.log("Already Commit");
    res.json({ updateProduct });
  } catch (err) {
    await t.rollback();
    next(err);
  } finally {
    // console.log(req.files);
    if (req.files.productPic) {
      fs.unlinkSync(req.files.productPic[0].path);
    }
    if (req.files.sizeGuide) {
      fs.unlinkSync(req.files.sizeGuide[0].path);
    }
  }
};

// exports.getUserPost = async (req, res, next) => {
//   try {
//     //SELECT * FROM posts WHERE user_id IN()
//     // const friendIds = await FriendService.findFriendId(req.user.id); //id ของเพื่อนทั้งหมดที่เป็นarray
//     // let allId = friendIds.push(req.user.id); // เอา id ของเรา pushเข้าไปด้วย รวมเป็น all id
//     const userId = await FriendService.findFriendId(req.user.id); //id ของเพื่อนทั้งหมดที่เป็นarray  [friendId1,friendId2,friendId3, ...]
//     userId.push(req.user.id); // เอา id ของเรา pushเข้าไปด้วย Add myId to userId => [friendId1,friendId2,friendId3, ... , myId]
//     const posts = await Post.findAll({
//       where: { userId }, //userId เป็น array  where จะใช้ method IN หาpost เฉพาะคนที่เป็นเพื่อนกัน//WHERE userId IN (friendId1,friendId2,friendId3, ... , myId) = WHERE userId = 1 OR userId = 2 OR userId =3 OR ...
//       order: [["updatedAt", "DESC"]],
//       attributes: {
//         exclude: ["userId"],
//       },
//       include: [
//         {
//           model: User,
//           attributes: {
//             exclude: [
//               "password",
//               "email",
//               "phoneNumber",
//               "coverPhoto",
//               "createAt",
//             ],
//           },
//         },
//         {
//           model: Like,
//           attributes: {
//             exclude: ["createdAt"],
//           },
//           include: {
//             model: User,
//             attributes: {
//               exclude: [
//                 "password",
//                 "email",
//                 "phoneNumber",
//                 "coverPhoto",
//                 "createAt",
//               ],
//             },
//           },
//         },
//         {
//           model: Comment,
//           attributes: {
//             exclude: ["createdAt", "userId"],
//           },
//           include: {
//             model: User,
//             attributes: {
//               exclude: [
//                 "password",
//                 "email",
//                 "phoneNumber",
//                 "coverPhoto",
//                 "createAt",
//               ],
//             },
//           },
//         },
//       ],
//     });
//     res.json({ posts });
//   } catch (err) {
//     next(err);
//   }
// };
