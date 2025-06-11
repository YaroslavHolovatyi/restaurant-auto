const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads", "menu");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect("mongodb://localhost:27017/BoomerBurger", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use("/api/dishes", require("./routes/dishes"));
app.use("/api/staff", require("./routes/staff"));
app.use("/api/tables", require("./routes/tables"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/menuOffers", require("./routes/menuOffers"));
app.use("/api/menu", require("./routes/menu"));
app.use("/api/recipes", require("./routes/recipes"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
