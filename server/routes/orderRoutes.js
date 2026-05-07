const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// PLACE ORDER
router.post("/place", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ message: "Order Placed", success: true });
  } catch (err) {
    res.status(500).json({ message: "Error placing order", error: err });
  }
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Naye orders upar dikhenge
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// MARK DELIVERED (URL: /orders/deliver/:id)
router.put("/deliver/:id", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      status: "Delivered"
    });
    res.json({ message: "Delivered", success: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE ORDER (URL: /orders/delete/:id)
router.delete("/delete/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

module.exports = router;