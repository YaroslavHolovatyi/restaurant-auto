const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// Get a single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order', details: error.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    console.log('Creating order with data:', req.body);
    const order = new Order(req.body);
    await order.save();
    console.log('Created order:', order);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Update an order
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating order with ID:', req.params.id);
    console.log('Request body:', req.body);
    
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    console.log('Updated order:', order);
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order', details: error.message });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router; 