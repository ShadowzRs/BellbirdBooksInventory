const express = require("express");
const cors = require("cors");

require("./database/initDatabase");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const stockRoutes = require("./routes/stockRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stock", stockRoutes);

// const orderRoutes = require("./routes/orders");
// app.use("/api/orders", orderRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
