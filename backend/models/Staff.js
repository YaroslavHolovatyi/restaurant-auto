const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "cook", "waiter"], required: true },
});

module.exports = mongoose.model("Staff", StaffSchema);
