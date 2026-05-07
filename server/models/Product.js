const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  images: {
    type:[String],
  default:[]},

  ratings: [
    {
      value: Number
    }
  ]
});

module.exports = mongoose.model("Product", productSchema);