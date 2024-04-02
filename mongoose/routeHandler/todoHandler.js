const express = require("express");
const mongoose = require("mongoose");
const todoSchema = require("../schema/todoSchema");

const router = express.Router();
const Todo = mongoose.model("Todo", todoSchema);

router.get("/", async (req, res) => {
  try {
    const result = await Todo.find();
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

router.get("/:id", async (req, res) => {
    try {
        const result = await Todo.find({_id: req.params.id});
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

router.post("/", async (req, res) => {
  const newTodo = new Todo(req.body);

  try {
    await newTodo.save();
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
        const result = await Todo.deleteOne({_id: req.params.id});
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
