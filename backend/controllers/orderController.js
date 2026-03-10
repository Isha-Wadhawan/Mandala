import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';

// placing orders using UPI (dynamic link)
const placeOrder = async (req, res) => {
  try {
    
    const { userId, items, amount, address } = req.body;

    // your fixed UPI ID
    const upiId = "yourupi@oksbi";
    const name = "MandalaByJigyasa";

    // generate UPI payment link
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      name
    )}&am=${amount}&cu=INR`;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "UPI",
      payment: false, // set true manually/admin once confirmed
      date: Date.now(),
      upiLink, // store link in DB (optional)
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order placed, complete payment via UPI",
      upiLink,
      orderId: newOrder._id,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// All orders data for Admin
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// User order data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// Update order status from admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status, payment } = req.body;
    // allow updating status and/or payment manually
    await orderModel.findByIdAndUpdate(orderId, { status, payment });
    res.json({ success: true, message: "Order Updated" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

export { placeOrder, allOrders, userOrders, updateStatus };
