const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("token", TokenSchema);