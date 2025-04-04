const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes");

dotenv.config();

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.error("MongoDB Connection Failed:", err));

// Use Routes
app.use("/api/users", userRoutes);

const PORT = 3100;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
