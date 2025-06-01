import { Schema } from 'mongoose';

const RecipeSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'Staff' },
    image_url: { type: String, required: true },
    approved: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

export default RecipeSchema;
  