// const express = require("express");
// const app = express();
// const PORT = 5000;
// //Middleware:
// app.use(express.json());
// let users = [
//   { id: 1, name: "Ali" },
//   { id: 2, name: "Ahmed" },
//   { id: 3, name: "Sara" },
// ];

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });
// // Read- Get all
// app.get("/users", (req, res) => {
//   res.json({ status: 200, message: "Data fetch successfully,", data: users });
// });

// //Read (Get One):
// app.get("/users/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const user = users.find((u) => u.id === id);
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   res.json(user);
// });

// //Create Post
// app.post("/users", (req, res) => {
//   const { name } = req.body;
//   const newUser = {
//     id: users.length + 1,
//     name,
//   };
//   users.push(newUser);
//   res.status(201).json({ message: "User found", user: newUser });
// });

// //Update(PUT):
// app.put("/users/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const { name } = req.body;
//   const user = users.find((u) => u.id === id);
//   if (!user) {
//     return res.status(404).json({ message: "Not found" });
//   }
//   user.name = name;
//   res.json({
//     message: "user updated",
//     user,
//   });
// });

// //Delete:

// app.delete("/users/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const index = users.findIndex((u) => u.id === id);
//   if (index === -1) {
//     return res.status(404).json({ message: "Not found" });
//   }
//   users.splice(index, 1);
//   res.json({
//     message: "Deleted",
//   });
// });

// app.listen(PORT, () => {
//   console.log(`App listening on port 5000!..${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/myDatabase")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* ===========================
        CREATE USER
=========================== */

app.post("/users", async (req, res) => {
  try {
    const { name } = req.body;
    const user = new User({
      name,
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===========================
   READ ALL / FILTER / SORT /
      PAGINATION
=========================== */

app.get("/users", async (req, res) => {
  try {
    const { id, name, page = 1, limit = 5, sort = "name" } = req.query;

    // Search by ID
    if (id) {
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      return res.json(user);
    }

    // Filtering
    const filter = {};// means find everything
    if (name) {
      filter.name = name;
    }
    const users = await User.find(filter)
    // ?sort=name for Ascending and ?sort=-name for descending
      .sort(sort) 
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ===========================
      READ ONE BY PARAM
=========================== */

app.get("/users/:id", async (req, res) => {
  console.log("tis is data 2");
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ===========================
     UPDATE ONE BY PARAM
=========================== */

app.put("/users/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true },
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ===========================
 UPDATE BY QUERY
 Example:
/users/update?id=...
/users/update?name=Ali
=========================== */

app.put("/users/update", async (req, res) => {
  try {
    const { id, name: oldName } = req.query;
    const { name } = req.body;
    // Update One by ID
    if (id) {
      const user = await User.findByIdAndUpdate(id, { name }, { new: true });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      return res.json(user);
    }

    // Update Many by Name
    if (oldName) {
      const result = await User.updateMany({ name: oldName }, { name });
      return res.json(result);
    }
    res.status(400).json({
      message: "Provide id or name in query",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ===========================
      UPDATE ALL USERS
=========================== */

app.put("/users", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await User.updateMany({}, { name });
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ===========================
    DELETE ONE BY PARAM
=========================== */

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json({
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ===========================
 DELETE BY QUERY
 Example:
/users/delete?id=...
/users/delete?name=Ali
=========================== */

app.delete("/users/delete", async (req, res) => {
  try {
    const { id, name } = req.query;
    if (id) {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      return res.json({
        message: "User deleted",
      });
    }
    if (name) {
      const result = await User.deleteMany({
        name,
      });
      return res.json(result);
    }
    res.status(400).json({
      message: "Provide id or name",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* ===========================
      DELETE ALL USERS
=========================== */

app.delete("/users", async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({
      message: "All users deleted",
      result,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
