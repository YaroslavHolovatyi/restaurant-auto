const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

// Get all staff
router.get('/', async (req, res) => {
  const staff = await Staff.find();
  res.json(staff);
});

// Get a single staff member
router.get('/:id', async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) return res.status(404).json({ error: 'Not found' });
  res.json(staff);
});

// Create a new staff member
router.post('/', async (req, res) => {
  const staff = new Staff(req.body);
  await staff.save();
  res.json(staff);
});

// Update a staff member
router.put('/:id', async (req, res) => {
  const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(staff);
});

// Delete a staff member
router.delete('/:id', async (req, res) => {
  await Staff.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username, password);
  const user = await Staff.findOne({ username, password });
  console.log('User found:', user);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json(user);
});

// DEBUG: List all staff usernames and passwords
router.get('/debug/all-users', async (req, res) => {
  const users = await Staff.find({}, { username: 1, password: 1, _id: 0 });
  res.json(users);
});

module.exports = router; 