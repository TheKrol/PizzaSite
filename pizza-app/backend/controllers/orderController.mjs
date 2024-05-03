// Import necessary modules and models
import Order from "../models/orderModel.mjs";

// Handle a request to add an item to the cart
const addCart = async (req, res) => {
  const { email, orderType, items, orderNote } = req.body;

  try {
    // Create a new order item
    const newOrderItem = new Order({
      email,
      orderType,
      items,
      orderNote,
    });

    // Save the new order item to the database
    await newOrderItem.save();

    res.status(201).json(newOrderItem); // Respond with the saved item
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not add item to cart' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not retrieve orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update order status' });
  }
};

export default {
  addCart,
  getAllOrders,
  updateOrderStatus
};