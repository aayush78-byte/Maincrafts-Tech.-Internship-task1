require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const itemsRouter = require("./routes/items");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/items", itemsRouter);

// Simple health check route
app.get("/", (req, res) => {
  res.send("MERN Task 1 API is running");
});

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

// Use MongoDB when it is configured. For a local demo with no Atlas
// connection string, the routes fall back to an in-memory task store.
if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
      startServer();
    })
    .catch((err) => {
      console.error("MongoDB connection error; using in-memory task storage:", err.message);
      startServer();
    });
} else {
  console.log("No MONGO_URI configured; using in-memory task storage.");
  startServer();
}
