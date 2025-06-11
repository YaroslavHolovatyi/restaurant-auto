const express = require("express");
const router = express.Router();
const MenuOffer = require("../models/MenuOffer");
const Dish = require("../models/Dish");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/menu");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Check MIME type
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      return cb(null, true);
    }

    // Also check file extension as backup
    const filetypes = /\.(jpeg|jpg|png)$/i;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (extname) {
      return cb(null, true);
    }

    cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  },
});

// Get all menu offers
router.get("/", async (req, res) => {
  const offers = await MenuOffer.find();
  res.json(offers);
});

// Get a single menu offer
router.get("/:id", async (req, res) => {
  const offer = await MenuOffer.findById(req.params.id);
  if (!offer) return res.status(404).json({ error: "Not found" });
  res.json(offer);
});

// Create a new menu offer
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      weight,
      is_new,
      available,
      createdBy,
    } = req.body;

    const offer = new MenuOffer({
      name,
      price: parseFloat(price),
      description,
      category,
      image_url: req.file ? `/uploads/menu/${req.file.filename}` : null,
      weight,
      is_new: is_new === "true" || is_new === true,
      available: available === "true" || available === true,
      createdBy,
    });

    await offer.save();
    res.status(201).json(offer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a menu offer
router.put("/:id", async (req, res) => {
  const offer = await MenuOffer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(offer);
});

// Delete a menu offer
router.delete("/:id", async (req, res) => {
  await MenuOffer.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Accept a menu offer (admin)
router.post("/:id/accept", auth, async (req, res) => {
  const offer = await MenuOffer.findById(req.params.id);
  if (!offer) return res.status(404).json({ error: "Not found" });
  // Move to Dish collection
  const dish = new Dish({
    name: offer.name,
    price: offer.price,
    currency: "UAH",
    description: offer.description,
    category: offer.category,
    image_url: offer.image_url,
    weight: offer.weight,
    is_new: offer.is_new,
    available: offer.available,
  });
  await dish.save();
  offer.status = "accepted";
  await offer.save();
  res.json({ success: true, dish });
});

// Reject a menu offer (admin)
router.post("/:id/reject", auth, async (req, res) => {
  const offer = await MenuOffer.findById(req.params.id);
  if (!offer) return res.status(404).json({ error: "Not found" });
  offer.status = "rejected";
  await offer.save();
  res.json({ success: true });
});

module.exports = router;
