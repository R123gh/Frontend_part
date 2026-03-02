const express = require("express");
const path = require("path");
const app = require("./src/app");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });


app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const ragRoutes = require("./routes/rag");
app.use("/api/rag", ragRoutes);

app.get("/", (req, res) => {
  res.send("running");
});


connectDB();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
