const mongoose = require("mongoose");

const SurgerySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    pt_id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    dateTime: {
        type: Number,
        required: true
    },
    surgeon: {
        type: String,
        required: true
    },
    patient: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    prescription: {
        type: String
    },
    instructions: {
        type: String
    },
    status: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("surgery", SurgerySchema);