const express = require("express");
const mongoose = require("mongoose");
const todoSchema = require("../schema/todoSchema");
const userSchema = require("../schema/userSchema");
const checkLogin = require("../middlewares/checkLogin");

const router = express.Router();
const Todo = mongoose.model("Todo", todoSchema);
const User = mongoose.model("User", userSchema);

router.get("/", checkLogin, async (req, res) => {
  try {
    const result = await Todo.find().populate("user", "name username -_id").select({ date: 0, __v: 0 });
    res.status(200).json({
      data: result,
      message: "Todo's were retrieved successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was server side error!",
    });
  }
});

router.get("/active", async (req, res) => {
  try {
    const todo = new Todo();
    const result = await todo.findActive();
    res.status(200).json({
      data: result,
      message: "Active todo's were retrieved successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was server side error!",
    });
  }
});

router.get("/js", async (req, res) => {
  try {
    const result = await Todo.findByJS();
    res.status(200).json({
      data: result,
      message: "Todo's with keyword js in title were retrieved successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was server side error!",
    });
  }
});

router.get("/language", async (req, res) => {
  try {
    const result = await Todo.find().byLanguage("vanilla js");
    res.status(200).json({
      data: result,
      message: "Todo's with keyword vanilla js in title were retrieved successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was server side error!",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await Todo.find({ _id: req.params.id });
    res.status(200).json({
      data: result,
      message: "Todo was retrieved successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was server side error!",
    });
  }
});

router.post("/", checkLogin, async (req, res) => {
  const newTodo = new Todo({ ...req.body, user: req.userId });
  try {
    const todo = await newTodo.save();
    await User.updateOne(
      { _id: req.userId },
      {
        $push: {
          todo: todo._id,
        },
      }
    );

    res.status(200).json({
      message: "Todo was inserted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was server side error!",
    });
  }
});

router.post("/all", async (req, res) => {
  try {
    await Todo.insertMany(req.body);
    res.status(200).json({
      message: "Todo's were inserted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was server side error!",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await Todo.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: "active",
        },
      }
    );
    res.status(200).json({
      message: "Todo was updated successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was server side error!",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Todo.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "Todo was deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was server side error!",
    });
  }
});

module.exports = router;
