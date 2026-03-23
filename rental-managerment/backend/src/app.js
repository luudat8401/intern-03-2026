const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/users", require("./routes/user.routes"));
app.use("/masters", require("./routes/master.routes"));
app.use("/rooms", require("./routes/room.routes"));
app.use("/contracts", require("./routes/contract.routes"));
app.get("/", (req, res) => {
  res.send("Server running and connected to MongoDB");
});

module.exports = app;