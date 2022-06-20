const {
  CartItem,
  Customer,
  Admin,
  Product,
  ProductOption,
  Order,
  OrderItem,
  sequelize,
} = require("../../models");
const createError = require("../../middlewares/error");

exports.submitOrder = async (req, res, next) => {
  // console.log(req.body)
  try {
    const result = await sequelize.transaction(async (t) => {
      const { deliveryPrice, totalPrice, cartItemsIds } = req.body;

      const order = await Order.create({
        customerId: req.customer.id,
        totalPrice,
        deliveryPrice,
      });
      // console.log(cartItemsIds)
      // console.log(typeof cartItemsIds)
      const ArrayCartItemsIds = JSON.parse(JSON.stringify(cartItemsIds));
      // console.log(ArrayCartItemsIds)
      ArrayCartItemsIds.map(async (el) => {
        // const { inventory } = await Product.findOne({
        //   where: {
        //     id: item.productId,
        //   },
        // });

        // if (inventory >= item.quantity) {

        // console.log(el)
        //el เป็นแค่ idของ cartItemนั้น
        const cartItems = await CartItem.findOne({
          where: { id: el },
          include: [
            {
              model: Customer,
              attributes: {
                exclude: ["password"],
              },
            },
            {
              model: ProductOption,
              include: [{ model: Product }],
            },
          ],
        });

        console.log(cartItems);

        await OrderItem.create({
          orderId: order.id,
          cartItems: cartItems.ProductOption.id,
          quantity: cartItems.quantity,
          price: cartItems.ProductOption.Product.price,
          productOptionId: cartItems.ProductOption.id,
        });
        await CartItem.destroy({ where: { id: el } });


      //   //   } else {
      //   //     createError("not enough inventory", 502);
      //   //   }
      });

      res.status(201).json({ order });
    });
  } catch (err) {
    next(err);
  }
};

exports.getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { customerId: req.customer.id },
      include: [
        {
          model: Customer,
          attributes: {
            exclude: ["password"],
          },
        },
        {
          model: OrderItem,
          include: [
            {
              model: ProductOption,
              include: [
                {
                  model: Product,
                },
              ],
            },
          ],
        },
      ],
    });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    role= req.role
    if (role === "admin") {
      const orders = await Order.findAll({
        include: [
          {
            model: Customer,
            attributes: {
              exclude: ["password"],
            },
          },
          {
            model: OrderItem,
            include: [
              {
                model: ProductOption,
                include: [
                  {
                    model: Product,
                  },
                ],
              },
            ],
          },
        ],
      });
      res.json({ orders });
    } else {
      createError("you are not admin", 401);
    }
  } catch (err) {
    next(err);
  }
};
