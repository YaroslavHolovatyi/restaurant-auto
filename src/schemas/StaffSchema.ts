import { Schema } from 'mongoose';

const StaffSchema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ['chef', 'waiter', 'manager'] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now }
});

export default StaffSchema;
  