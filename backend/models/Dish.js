const mongoose = require("mongoose");

const DishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: "UAH" },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image_url: { type: String },
  weight: { type: String },
  is_new: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
});

module.exports = mongoose.model("Dish", DishSchema);
