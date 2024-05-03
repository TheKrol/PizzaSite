import mongoose from 'mongoose';

const trackingSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    shift: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

export default mongoose.model("tracking", trackingSchema);