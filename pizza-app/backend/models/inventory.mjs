import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unitType: {
        type: String,
        required: true
    },
});

export default mongoose.model("inventory", inventorySchema);