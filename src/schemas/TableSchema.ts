import { Schema } from 'mongoose';

const TableSchema = new Schema({
    number: { type: Number, required: true, unique: true },
    seats: { type: Number, required: true },
    status: { type: String, enum: ['free', 'occupied', 'reserved'], default: 'free' }
});

export default TableSchema;
  