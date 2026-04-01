const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { verifyToken } = require("./middleware/auth.middleware");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/auth", require("./routes/auth.routes"));
app.use("/users", verifyToken, require("./routes/user.routes"));
app.use("/masters", verifyToken, require("./routes/master.routes"));
app.use("/rooms", verifyToken, require("./routes/room.routes"));
app.use("/contracts", verifyToken, require("./routes/contract.routes"));

app.get("/", (req, res) => {
  res.send("Server running and connected to PostgreSQL (TypeORM)");
});

module.exports = app;
