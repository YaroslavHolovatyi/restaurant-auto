const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
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

// Get all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending recipes only
router.get("/pending", async (req, res) => {
  try {
    const pendingRecipes = await Recipe.find({ status: "pending" });
    res.json(pendingRecipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recipes by author
router.get("/author/:author", async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.params.author });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new recipe
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
      author,
    } = req.body;

    const recipeData = {
      name,
      price: parseFloat(price),
      description,
      category,
      weight,
      is_new: is_new === "true",
      available: available === "true",
      author: author || "cook",
      status: "pending",
    };

    if (req.file) {
      recipeData.image_url = `/uploads/menu/${req.file.filename}`;
    }

    const recipe = new Recipe(recipeData);
    await recipe.save();

    res.status(201).json({ message: "Recipe created successfully", recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single recipe
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept a recipe (move to dishes collection)
router.post("/:id/accept", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Create a new dish from the recipe
    const newDish = new Dish({
      name: recipe.name,
      price: recipe.price,
      currency: recipe.currency,
      description: recipe.description,
      category: recipe.category,
      image_url: recipe.image_url,
      weight: recipe.weight,
      is_new: recipe.is_new,
      available: recipe.available,
    });

    await newDish.save();

    // Update recipe status to accepted
    recipe.status = "accepted";
    await recipe.save();

    res.json({ message: "Recipe accepted and added to menu", dish: newDish });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject a recipe
router.post("/:id/reject", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    recipe.status = "rejected";
    await recipe.save();

    res.json({ message: "Recipe rejected", recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a recipe
router.delete("/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
