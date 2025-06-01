const express = require('express');
const router = express.Router();
const MenuOffer = require('../models/MenuOffer');
const Dish = require('../models/Dish');

// Get all menu offers
router.get('/', async (req, res) => {
  const offers = await MenuOffer.find();
  res.json(offers);
});

// Get a single menu offer
router.get('/:id', async (req, res) => {
  const offer = await MenuOffer.findById(req.params.id);
  if (!offer) return res.status(404).json({ error: 'Not found' });
  res.json(offer);
});

// Create a new menu offer
router.post('/', async (req, res) => {
  const offer = new MenuOffer(req.body);
  await offer.save();
  res.json(offer);
});

// Update a menu offer
router.put('/:id', async (req, res) => {
  const offer = await MenuOffer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(offer);
});

// Delete a menu offer
router.delete('/:id', async (req, res) => {
  await MenuOffer.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Accept a menu offer (admin)
router.post('/:id/accept', async (req, res) => {
  const offer = await MenuOffer.findById(req.params.id);
  if (!offer) return res.status(404).json({ error: 'Not found' });
  // Move to Dish collection
  const dish = new Dish({
    name: offer.name,
    price: offer.price,
    currency: 'UAH',
    description: offer.description,
    category: offer.category,
    image_url: offer.image_url,
    weight: offer.weight,
    is_new: offer.is_new,
    available: offer.available
  });
  await dish.save();
  offer.status = 'accepted';
  await offer.save();
  res.json({ success: true, dish });
});

// Reject a menu offer (admin)
router.post('/:id/reject', async (req, res) => {
  const offer = await MenuOffer.findById(req.params.id);
  if (!offer) return res.status(404).json({ error: 'Not found' });
  offer.status = 'rejected';
  await offer.save();
  res.json({ success: true });
});

module.exports = router; 