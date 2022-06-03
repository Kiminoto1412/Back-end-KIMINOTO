const { Product, ProductOption } = require("../models");
const fs = require("fs");
const createError = require("../utils/createError");
const cloudinary = require("../utils/cloudinary");
const FriendService = require("../services/friendService");

exports.createProduct = async (req, res, next) => {
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

    // const product = {
    //   name,
    //   price,
    //   productPic,
    //   sizeGuide,
    //   productDescription,
    //   stock,
    // };

    //ไว้ใส่ value ของ stock
    // "[
    //   { "size": "s", "color": "green", "quantity": "10" },
    //    { "size": "s", "color": "red", "quantity": "5" },
    //  ]"

    const { name, price, productPic, sizeGuide, productDescription, stock } =
      req.body;

    const Obj = JSON.parse(stock)
    console.log(Obj)

    const t = await sequelize.transaction();

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
      { name, price, productPic, sizeGuide, productDescription },
      { transaction: t }
    );

    // Modified Stock Obj
    const { id } = product;
    const newStock = stock.map((obj) => {
      obj.product_id = id;
    });

    /*  
      newStock : [
        {size:"s",color:"green",quantity:10,product_id : 5},
        {size:"s",color:"red",quantity:5,product_id : 5},
        ]
    */

    //Create Table ProductOption
    const product_option = await ProductOption.bulkCreate(newStock, {
      transaction: t,
    });
    
    await t.commit();
    res.json({ product });
  } catch (err) {
    await t.rollback();
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.createLike = async (req, res, next) => {
  const t = await sequelize.transaction(); //start transaction
  try {
    const { postId } = req.params;
    const existLike = await Like.findOne({
      where: { userId: req.user.id, postId: postId },
    });

    if (existLike) {
      createError("you already liked this post", 400);
    }
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      createError("post not found", 400);
    }

    const like = await Like.create(
      {
        postId,
        userId: req.user.id,
      },
      { transaction: t }
    );

    // await post.increment(['like'],{by:1})
    // await post.increment("like", { by: 1 });
    await post.increment({ like: 1 }, { transaction: t });
    await t.commit(); //บันทึกtransaction

    res.json({ like });
  } catch (err) {
    await t.rollback(); //ถ้ามีerrorระหว่างทาง rollbackให้หมดเลย ไม่มีการสร้างตารางlike และ update postว่ามีlikeเพิ่ม
    next(err);
  }
};

exports.deleteLike = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction(); //start transaction
    const { postId } = req.params;
    const like = await Like.findOne({
      where: { userId: req.user.id, postId: postId },
    });

    if (!like) {
      createError("you never like this post", 400);
    }
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      createError("post not found", 400);
    }

    await like.destroy({ transaction: t });
    await post.decrement({ like: 1 }, { transaction: t });
    await t.commit(); //บันทึกtransaction

    res.json({ like });
  } catch (err) {
    await t.rollback(); //ถ้ามีerrorระหว่างทาง rollbackให้หมดเลย ไม่มีการสร้างตารางlike และ update postว่ามีlikeเพิ่ม
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (!title && !req.file) {
      createError("title or image is required", 400);
    }
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      createError("post not found", 400);
    }
    if (post.userId !== req.user.id) {
      createError("you have no permission", 403);
    }

    if (req.file) {
      if (post.image) {
        //ถ้าpost มีรูปอยู่ต้องไปลบในcloudinary ด้วย
        const splited = post.image.split("/");
        const publicId = splited[splited.length - 1].split(".")[0];
        await cloudinary.destroy(publicId);
      }
      const result = await cloudinary.upload(req.file.path);
      post.image = result.secure_url;
    }

    if (title) {
      post.title = title;
    }
    await post.save();
    res.json({ post });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.deletePost = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction(); //เขียนแบบนี้ดีกว่า เพราะดักจับerror ของบรรทัดนี้ได้ด้วย
    const { id } = req.params;
    const post = await Post.findOne({ where: { id } }); //เอาid มาหาpost
    if (!post) {
      createError("post not found", 400);
    }
    if (post.userId !== req.user.id) {
      createError("you have no permission", 403);
    }
    await Comment.destroy({ where: { postId: id } }, { transaction: t });
    await Like.destroy({ where: { postId: id } }, { transaction: t });

    if (post.image) {
      //ถ้าpost มีรูปอยู่ต้องไปลบในcloudinary ด้วย
      const splited = post.image.split("/");
      const publicId = splited[splited.length - 1].split(".")[0];
      await cloudinary.destroy(publicId);
    }
    await Post.destroy({ where: { id } }, { transaction: t });
    await t.commit();
    res.status(204).json();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.getUserPost = async (req, res, next) => {
  try {
    //SELECT * FROM posts WHERE user_id IN()
    // const friendIds = await FriendService.findFriendId(req.user.id); //id ของเพื่อนทั้งหมดที่เป็นarray
    // let allId = friendIds.push(req.user.id); // เอา id ของเรา pushเข้าไปด้วย รวมเป็น all id
    const userId = await FriendService.findFriendId(req.user.id); //id ของเพื่อนทั้งหมดที่เป็นarray  [friendId1,friendId2,friendId3, ...]
    userId.push(req.user.id); // เอา id ของเรา pushเข้าไปด้วย Add myId to userId => [friendId1,friendId2,friendId3, ... , myId]
    const posts = await Post.findAll({
      where: { userId }, //userId เป็น array  where จะใช้ method IN หาpost เฉพาะคนที่เป็นเพื่อนกัน//WHERE userId IN (friendId1,friendId2,friendId3, ... , myId) = WHERE userId = 1 OR userId = 2 OR userId =3 OR ...
      order: [["updatedAt", "DESC"]],
      attributes: {
        exclude: ["userId"],
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: [
              "password",
              "email",
              "phoneNumber",
              "coverPhoto",
              "createAt",
            ],
          },
        },
        {
          model: Like,
          attributes: {
            exclude: ["createdAt"],
          },
          include: {
            model: User,
            attributes: {
              exclude: [
                "password",
                "email",
                "phoneNumber",
                "coverPhoto",
                "createAt",
              ],
            },
          },
        },
        {
          model: Comment,
          attributes: {
            exclude: ["createdAt", "userId"],
          },
          include: {
            model: User,
            attributes: {
              exclude: [
                "password",
                "email",
                "phoneNumber",
                "coverPhoto",
                "createAt",
              ],
            },
          },
        },
      ],
    });
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};
