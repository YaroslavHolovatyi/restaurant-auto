const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  waiterId: { type: String, required: true },
  status: {
    type: String,
    enum: ["ordered", "cooking", "ready"],
    default: "ordered",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
