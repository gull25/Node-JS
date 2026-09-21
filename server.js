require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myDatabase")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Create User:
app.post("/users", async (req, res) => {
  try {
    const { name } = req.body;
    const user = new User({ name });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read all users:
app.get("/users/all", async (req, res) => {
  console.log("Fetching all users");

  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read one user by ID parameter:
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update one user:
app.put("/users", async (req, res) => {
  try {
    const { id } = req.query;
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(id, { name }, { new: true });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete one user:
app.delete("/users", async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json({
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search by name:
app.get("/users", async (req, res) => {
  try {
    const { name } = req.query;
    const users = await User.find({
      name: name,
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Pagination:
app.get("/users/paginate", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Count users:
app.get("/users/stats/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete all users:
app.delete("/users/all", async (req, res) => {
  try {
    const result = await User.deleteMany();
    res.json({ message: `${result.deletedCount} users deleted` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update one user by ID parameter:
app.patch("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete one user by ID parameter:
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get recent users (latest 5):
app.get("/users/stats/recent", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const users = await User.find().sort({ _id: -1 }).limit(limit);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Advanced search by multiple fields:
app.get("/users/search/advanced", async (req, res) => {
  try {
    // Build a dynamic query object based on provided query parameters
    const query = {};
    if (req.query.name) query.name = new RegExp(req.query.name, 'i');
    if (req.query.email) query.email = new RegExp(req.query.email, 'i');
    
    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
