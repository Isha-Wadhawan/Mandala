import mongoose from "mongoose";

// Define schema with correct fields
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    cartData: {
        type: Object,
        default: {}
    }

}, {
    minimize: false  // ✅ Correct placement of minimize option
});

// Create or reuse the model
const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
