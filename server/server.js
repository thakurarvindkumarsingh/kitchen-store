const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

app.use('/uploads', express.static('uploads'));

const productRoutes = require("./routes/productRoutes");
app.use("/products", productRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/orders", orderRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Server is running 🔥");
});

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running 🚀");
    });
  })
  .catch((err) => {
    console.log("DB Error ❌", err);
  });

// ❌ YE HATA DO
// app.listen(5000, () => {
//   console.log("Server started on port 5000");
// });
