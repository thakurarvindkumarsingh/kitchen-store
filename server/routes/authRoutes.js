const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// SIGNUP
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hash
  });

  await newUser.save();

  res.json({ message: "User Registered" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.json({ message: "Wrong password" });

  res.json({ message: "Login Success", user });
});

module.exports = router;