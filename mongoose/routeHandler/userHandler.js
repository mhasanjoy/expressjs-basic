const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../schema/userSchema");

const router = express.Router();
const User = mongoose.model("User", userSchema);

// signup
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
      status: req.body.status,
    });

    await newUser.save();
    res.status(200).json({
      message: "Signup was successful!",
    });
  } catch {
    res.status(500).json({
      error: "Signup failed!",
    });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });

    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);

      if (isValidPassword) {
        // generate token
        const token = jwt.sign(
          {
            userId: user[0]._id,
            username: user[0].username,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          access_token: token,
          message: "Login successful!",
        });
      } else {
        res.status(401).json({
          error: "Authentication failed!",
        });
      }
    } else {
      res.status(401).json({
        error: "Authentication failed!",
      });
    }
  } catch {
    res.status(401).json({
      error: "Authentication failed!",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await User.find({}).populate("todo");
    res.status(200).json({
      data: result,
      message: "Users were retrieved successfully!",
    });
  } catch {
    res.status(500).json({
      error: "There was server side error!",
    });
  }
});

module.exports = router;
