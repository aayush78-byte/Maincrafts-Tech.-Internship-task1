const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

let memoryItems = [];

const useMongo = () => Item.db.readyState === 1;
const createMemoryItem = ({ title, description }) => ({
  _id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  title: title.trim(),
  description: description?.trim() || "",
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// GET /api/items — fetch all items, newest first
router.get("/", async (req, res) => {
  try {
    const items = useMongo()
      ? await Item.find().sort({ createdAt: -1 })
      : [...memoryItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items", error: err.message });
  }
});

// POST /api/items — create a new item
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const newItem = useMongo()
      ? await Item.create({ title, description })
      : createMemoryItem({ title, description });
    if (!useMongo()) memoryItems.unshift(newItem);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to create item", error: err.message });
  }
});

// PATCH /api/items/:id — toggle completed / update fields
router.patch("/:id", async (req, res) => {
  try {
    let updated;
    if (useMongo()) {
      updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    } else {
      const index = memoryItems.findIndex((item) => item._id === req.params.id);
      if (index !== -1) {
        memoryItems[index] = {
          ...memoryItems[index],
          ...req.body,
          updatedAt: new Date().toISOString(),
        };
        updated = memoryItems[index];
      }
    }
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update item", error: err.message });
  }
});

// DELETE /api/items/:id — remove an item
router.delete("/:id", async (req, res) => {
  try {
    let deleted;
    if (useMongo()) {
      deleted = await Item.findByIdAndDelete(req.params.id);
    } else {
      const index = memoryItems.findIndex((item) => item._id === req.params.id);
      if (index !== -1) deleted = memoryItems.splice(index, 1)[0];
    }
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item", error: err.message });
  }
});

module.exports = router;
