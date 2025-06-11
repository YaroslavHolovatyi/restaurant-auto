const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

// Get all tables
router.get('/', async (req, res) => {
  const tables = await Table.find();
  res.json(tables);
});

// Get a single table
router.get('/:id', async (req, res) => {
  const table = await Table.findById(req.params.id);
  if (!table) return res.status(404).json({ error: 'Not found' });
  res.json(table);
});

// Create a new table
router.post('/', async (req, res) => {
  const table = new Table(req.body);
  await table.save();
  res.json(table);
});

// Update a table
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating table with ID:', req.params.id);
    console.log('Request body:', req.body);
    
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    
    console.log('Updated table:', table);
    res.json(table);
  } catch (error) {
    console.error('Error updating table:', error);
    res.status(500).json({ error: 'Failed to update table', details: error.message });
  }
});

// Delete a table
router.delete('/:id', async (req, res) => {
  await Table.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router; 