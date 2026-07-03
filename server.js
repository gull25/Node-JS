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
const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;

//Middleware:
app.use(express.json());

//Connect to MongoDB:
mongoose
  .connect("mongodb://127.0.0.1:27017/myDatabase")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//Create(POST)
app.post("/users", async (req, res) => {
  const { name } = req.body;
  const user = new User({
    name,
  });
  await user.save();
  res.status(201).json(user);
});

//Read all
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

//Read One:
app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  res.json(user);
});

//Update One:
app.put("/users/:id", async (req, res) => {
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
});

//Delete one
app.delete("/users/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({
    message: "User deleted",
  });
});

//Update all;
app.put("/users", async (req, res) => {
  const { name } = req.body;
  await User.updateMany({}, { name });
  res.json({
    message: "All users updated",
  });
});

//Delete All:
app.delete("/users", async (req, res) => {
  await User.deleteMany({});
  res.json({
    message: "All users deleted",
  });
});

//Search by User Name: /users?name=Ali
app.get("/users", (req, res) => {
  const { name } = req.query;
  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase() === name.toLowerCase(),
  );
  res.json(filteredUsers);
});

//Search by ID: /users?id=2
//For multiple queries: /users?name=Ali&id=1
app.get("/users", (req, res) => {
  const id = Number(req.query.id);
  const user = users.find((u) => u.id === id);
  res.json(user);
});

//Pagination:Suppose there are 100 users.
// Instead of sending all users, send only 5.
///users?page=2&limit=5
app.get("/users", (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  res.json(users.slice(start, end));
});

//Sorting: /users?sort=name
const sort = req.query.sort;
app.listen(PORT, () => console.log("server is running.."));
// Asynchronous
fs.readFile("data.txt", "utf8", (err, data) => {
  console.log(data);
});

// Synchronous
const data = fs.readFileSync("data.txt", "utf8");
console.log(data);
