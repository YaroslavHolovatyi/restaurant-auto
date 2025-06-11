const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  seats: { type: Number, required: true },
  status: { type: String, enum: ["free", "occupied", "booked"], default: "free" },
});

module.exports = mongoose.model("Table", TableSchema);
