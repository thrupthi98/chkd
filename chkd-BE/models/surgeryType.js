const mongoose = require("mongoose");

const SurgeryTypeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    prep: {
        type: Array,
        required: true
    },
    visit: {
        type: Array,
        required: true
    },
    homeCare: {
        type: Array,
        required: true
    },
    concern: {
        type: Array,
        required: true
    },
    followUp: {
        type: String,
        required: true
    },
    videos: {
        type: Array,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("surgery-type", SurgeryTypeSchema);