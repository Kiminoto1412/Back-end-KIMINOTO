const createError = require("../../utils/createError");
const { CartItem, Customer, Product ,ProductOption } = require("../../models");

exports.addCartItem = async (req, res, next) => {
  try {
    //   console.log(req)
    const { productOptionId, quantity } = req.body;

    let cartItem = await CartItem.findOne({
      where: {
        customerId: req.customer.id,
        productOptionId,
      },
    });

    if (!cartItem) {
      cartItem = await CartItem.create({
        productOptionId,
        quantity,
        // price:
        customerId: req.customer.id,
      });
    } else if (cartItem) {
      cartItem.quantity = +quantity;
      await cartItem.save();
    }
    res.json({ cartItem });
  } catch (err) {
    next(err);
  }
};

exports.changeQuantity = async(req,res,next) =>{
  try{
    const {productOptionId , quantity} =req.body

    await CartItem.update({quantity},{
      where: {
        customerId: req.customer.id,
        productOptionId,
      }
    });
    res.json({ quantity})
  }catch(err){
    next(err)
  }
}

exports.getCartItems = async (req, res, next) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { customerId: req.customer.id },
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

    res.json({ cartItems });
  } catch (err) {
    next(err);
  }
};

exports.deleteCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cartItem = await CartItem.findOne({ where: { id } });
    if (!cartItem) {
      createError("item not found in cart", 400);
    }

    await CartItem.destroy({ where: { id } });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
