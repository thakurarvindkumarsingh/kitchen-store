const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

app.use('/uploads', express.static('uploads'));
// 👇 IMPORTANT LINE
const productRoutes = require("./routes/productRoutes");


// 👇 CONNECT ROUTE
app.use("/products", productRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Server is running 🔥");
});

//order route
const orderRoutes = require("./routes/orderRoutes");

app.use("/orders", orderRoutes);

// DB connect
mongoose.connect("mongodb://127.0.0.1:27017/kitchenDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


app.get("/add-test", async (req, res) => {
  const Product = require("./models/Product");

  const newProduct = new Product({
    name: "Test Tawa",
    price: 400,
    images: "test.jpg",
    description: "Testing product",
    category: "Kitchen"
  });

  await newProduct.save();

  res.send("Test Product Added ✅");
});

// start server
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
