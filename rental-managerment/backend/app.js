require('dotenv').config(); 
const express = require("express");
const connectDB = require("./db");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(express.json());

connectDB();
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});
const masterSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);
const Master = mongoose.model("Master", masterSchema);

// Routes
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/masters", async (req, res) => {
  try {
    const master = new Master(req.body);
    await master.save();
    res.status(201).json(master);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/masters", async (req, res) => {
  try {
    const masters = await Master.find();
    res.json(masters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Server running and connected to MongoDB");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


