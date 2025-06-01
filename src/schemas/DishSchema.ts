import { Schema } from 'mongoose';

const DishSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    image_url: { type: String, required: true },
    description: { type: String, required: true },
    approved: { type: Boolean, default: true }
});

export default DishSchema;
  