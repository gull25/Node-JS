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

// //Create User:
// app.post("/users", async (req, res) => {
//   try {
//     const { name } = req.body;
//     const user = new User({ name });
//     await user.save();
//     res.status(201).json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// //Read all users:
// app.get("/users", async (req, res) => {
//   console.log("all get");

//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// //Read one user:
// app.get("/users2/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// //Update one user:
// app.put("/users/:id", async (req, res) => {
//   try {
//     const { name } = req.body;
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { name },
//       { new: true },
//     );
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// //Delete one user:
// app.delete("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }
//     res.json({
//       message: "User deleted",
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

//Query Parameters CRUD:
//Read one user:
// app.get("/users", async (req, res) => {
//   console.log("abc", req.query);

//   try {
//     const { id } = req.query;
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

//Update one user:
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

//Delete one user:
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

//Search by name:
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




//Delete all users:
// app.delete("/users", async (req, res) => {
//   try {
//     const result = await User.deleteMany({});
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


//Sorting: Ascending and Descending:
// app.get("/users", async (req, res) => {
//   try {
//     const { sort } = req.query;
//     const users = await User.find().sort(sort);
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

//Pagination:
// app.get("/users", async (req, res) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 5;
//     const users = await User.find()
//       .skip((page - 1) * limit)
//       .limit(limit);
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

//Filter+Sort:
// app.get("/users", async (req, res) => {
//   try {
//     const { name, sort } = req.query;
//     const users = await User.find({ name }).sort(sort);
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

//Filter + Sort + Pagination:
// app.get("/users", async (req, res) => {
//   try {
//     const { name, sort } = req.query;
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 5;
//     const users = await User.find({ name })
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit);
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
