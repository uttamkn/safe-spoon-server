const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.put("/sign_up", async (req, res) => {
  const { username, password, allergies } = req.body;

  try {
    let existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      allergies,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

router.post("/token", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        allergies: user.allergies,
      },
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).select(
      "customId username allergies"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user.customId,
      username: user.username,
      allergies: user.allergies,
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
