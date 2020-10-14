const mongoose = require("mongoose");

const SurgeonSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("surgeon", SurgeonSchema);