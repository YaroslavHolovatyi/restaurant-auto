const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

// Get all dishes
router.get('/', async (req, res) => {
  const dishes = await Dish.find();
  res.json(dishes);
});

// Get a single dish
router.get('/:id', async (req, res) => {
  const dish = await Dish.findById(req.params.id);
  if (!dish) return res.status(404).json({ error: 'Not found' });
  res.json(dish);
});

// Create a new dish
router.post('/', async (req, res) => {
  const dish = new Dish(req.body);
  await dish.save();
  res.json(dish);
});

// Update a dish
router.put('/:id', async (req, res) => {
  const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(dish);
});

// Delete a dish
router.delete('/:id', async (req, res) => {
  await Dish.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router; 