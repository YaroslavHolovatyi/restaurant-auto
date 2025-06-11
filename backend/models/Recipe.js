const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: "UAH" },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image_url: String,
  weight: String,
  is_new: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  author: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
