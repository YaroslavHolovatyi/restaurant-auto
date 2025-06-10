const mongoose = require("mongoose");

const MenuOfferSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  image_url: String,
  weight: String,
  is_new: Boolean,
  available: Boolean,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("MenuOffer", MenuOfferSchema);
