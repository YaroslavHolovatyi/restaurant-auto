const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://localhost:27017/BoomerBurger', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/api/dishes', require('./routes/dishes'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/menuOffers', require('./routes/menuOffers'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 