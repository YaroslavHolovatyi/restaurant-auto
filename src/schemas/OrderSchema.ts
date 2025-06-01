import { Schema } from 'mongoose';

const OrderSchema = new Schema({
    table: { type: Number, required: true },
    items: [
      {
        dish_id: { type: Schema.Types.ObjectId, ref: 'Dish' },
        quantity: { type: Number, required: true, min: 1 },
        status: { type: String, enum: ['ordered', 'cooking', 'ready', 'served'], default: 'ordered' }
      }
    ],
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
    created_at: { type: Date, default: Date.now }
});

export default OrderSchema;
  