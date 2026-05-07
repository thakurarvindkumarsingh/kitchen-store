const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  items: Array,
  total: Number,

  status: {
    type: String,
    default: "Pending"
  },

  isArchived: {
    type: Boolean,
    default: false
  }

}, { timestamps: true }); // ✅ date auto add

module.exports = mongoose.model("Order", orderSchema);