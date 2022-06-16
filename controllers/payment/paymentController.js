const fs = require("fs");
const cloudinary = require("../../utils/cloudinary");
const { Payment,Order } = require("../../models");
const createError = require("../../utils/createError");

exports.makePayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!req.file) {
      createError("payment slip is required", 400);
    }
    let image;
    if (req.file) {
      const result = await cloudinary.upload(req.file.path);
      image = result.secure_url;
    }

    const payment = await Payment.create({
      orderId,
      paymentSlip: image,
      status: "PENDING",
      customerId: req.customer.id,
    });
    res.json({ payment });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.editPaymentStatus = async (req, res, next) => {
  try {
    const {id}  = req.params
    const { status } = req.body;
    const updateValue = { status };

    if(status === "PURCHASED"){
      // จะหาproductOptionIdที่ถูกตัวเพื่อลบได้ไง

      //น่าจะหาorderก่อน แล้วหาproductOptionIdต่อ
      // const order = await Order.findOne({
      //   where:{id}
      // })
      // console.log(order)
      await CartItem.destroy({ where: { id: item.id } });
    }

    await Payment.update(updateValue, { where: { id: req.params.id } });
    res.json(updateValue);
  } catch (err) {
    next(err);
  }
};
