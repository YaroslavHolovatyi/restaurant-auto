const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Dish = require('../models/Dish');
const auth = require('../middleware/auth');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/menu')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new menu item
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, weight, is_new, available } = req.body;
    
    const dish = new Dish({
      name,
      price,
      description,
      category,
      image_url: req.file ? `/uploads/menu/${req.file.filename}` : null,
      weight,
      is_new: is_new === 'true',
      available: available === 'true'
    });

    const savedDish = await dish.save();
    res.status(201).json(savedDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a menu item
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, weight, is_new, available } = req.body;
    
    const updateData = {
      name,
      price,
      description,
      category,
      weight,
      is_new: is_new === 'true',
      available: available === 'true'
    };

    if (req.file) {
      updateData.image_url = `/uploads/menu/${req.file.filename}`;
    }

    const dish = await Dish.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    res.json(dish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a menu item
router.delete('/:id', auth, async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 