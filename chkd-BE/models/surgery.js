const mongoose = require("mongoose");

const SurgerySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
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
    patientAge: {
        type: String,
        required: true
    },
    prescription: {
        type: String
    },
    instructions: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("surgery", SurgerySchema);