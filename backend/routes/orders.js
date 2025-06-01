const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// Get a single order
router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});

// Create a new order
router.post('/', async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json(order);
});

// Update an order
router.put('/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(order);
});

// Delete an order
router.delete('/:id', async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router; 