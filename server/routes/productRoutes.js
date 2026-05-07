const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");
const Order = require("../models/Order");

// 🔥 BASE URL (for deployment + local)
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// 🔥 MULTER STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


// ✅ ADD PRODUCT (MULTIPLE IMAGES)
router.post("/add", upload.any(), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name & Price required" });
    }

    // 🔥 Multiple images URLs
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file =>
        `${BASE_URL}/uploads/${file.filename}`
      );
    }
    const newProduct = new Product({
      name,
      price,
      description,
      category,
      images: imageUrls
    });

    await newProduct.save();

    res.json({ message: "Product Added ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding product" });
  }
});


// ✅ GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});


// ❌ DELETE PRODUCT
router.delete("/delete/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product Deleted" });
});


// ✏️ UPDATE PRODUCT (MULTIPLE IMAGES)
router.put("/update/:id", upload.any(), async (req, res) => {
  try {
    let updateData = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category
    };

    // 🔥 If new images uploaded
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file =>
        `${BASE_URL}/uploads/${file.filename}`
      );
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);

    res.json({ message: "Product Updated ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Update failed" });
  }
});


// ⭐ ADD RATING
router.post("/rate/:id", async (req, res) => {
  const { value } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product.ratings) {
    product.ratings = [];
  }

  product.ratings.push({ value });

  await product.save();

  res.json({ message: "Rating added ⭐" });
});


// ⭐ GET AVERAGE RATING
router.get("/rating/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product.ratings || product.ratings.length === 0) {
    return res.json({ avg: 0 });
  }

  const total = product.ratings.reduce((sum, r) => sum + r.value, 0);
  const avg = total / product.ratings.length;

  res.json({ avg });
});


// ❌ DELETE ORDER
router.delete("/delete-order/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting order", error });
  }
});

module.exports = router;