import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

import 'dotenv/config';
const currency = 'INR';

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are missing in backend environment');
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// placing orders using Cash on Delivery
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// placing orders using Razorpay
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const razorpay = getRazorpayInstance();

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `temp_${Date.now()}`,
      notes: {
        userId,
        items: JSON.stringify(items),
        address: JSON.stringify(address),
        amount
      },
    });

    res.json({
      success: true,
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// verifying Razorpay payment signature
const verifyRazorpay = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const signaturePayload = `${razorpay_order_id}|${razorpay_payment_id}`;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(signaturePayload)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.json({ success: false, message: 'Payment verification failed' });
    }

    // 🔥 Fetch order details from Razorpay
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.fetch(razorpay_order_id);

    const { userId, items, address, amount } = order.notes;

    // 🧾 Create order in DB AFTER success
    const newOrder = new orderModel({
      userId,
      items: JSON.parse(items),
      amount,
      address: JSON.parse(address),
      paymentMethod: "Razorpay",
      payment: true,
      transactionRef: razorpay_payment_id,
      date: Date.now(),
    });

    await newOrder.save();

    // 🛒 Clear cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Payment successful & order created" });

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

export { placeOrder, placeOrderRazorpay, verifyRazorpay, allOrders, userOrders, updateStatus };
