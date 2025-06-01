const mongoose = require('mongoose');
const Staff = require('./models/Staff');

mongoose.connect('mongodb://localhost:27017/BoomerBurger', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const staff = [
  { name: "Admin User", username: "admin", password: "admin", role: "admin" },
  { name: "Cook User", username: "cook", password: "cook", role: "cook" },
  { name: "Waiter User", username: "waiter", password: "waiter", role: "waiter" }
];

async function seed() {
  await Staff.deleteMany({});
  await Staff.insertMany(staff);
  console.log("Staff seeded!");
  mongoose.disconnect();
}

seed();
