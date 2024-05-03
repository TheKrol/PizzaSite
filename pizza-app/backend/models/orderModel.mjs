import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  type: String,
  size: String,
  crust: String,
  sauce: String,
  toppings: {
    full: [String], // Full toppings
    left: [String], // Left side toppings
    right: [String], // Right side toppings
    salad: [String], // Salad toppings
  },
  dressing: String,
  name: String,
  quantity: Number,
  price: Number
});

const orderSchema = new mongoose.Schema({
  email: String,
  orderType: String,
  items: [orderItemSchema],
  orderNote: String,
  status: {
    type: String,
    enum: ['In Progress', 'Completed'],
    default: 'In Progress',
  },
}, { timestamps: true });

// Define a static method for adding an order item
orderSchema.statics.addOrderItem = async function (email, orderType, orderItem, orderNote) {
  try {
    const order = await this.findOneAndUpdate(
      { email, orderType },
      { $push: { items: orderItem } },
      { upsert: true, new: true },
      { orderNote }
    );
    return order;
  } catch (error) {
    throw new Error("Error adding order item: " + error);
  }
}

export default mongoose.model("order", orderSchema);