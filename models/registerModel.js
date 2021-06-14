const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'basic',
        enum: ["basic", "supervisor", "admin"]
    },
    accessToken: {
        type: String
    },
    email: {
        type: String,
        required: true,
        min: 5,
        max: 255,
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024,
    },
});

module.exports = mongoose.model("register", registerSchema);