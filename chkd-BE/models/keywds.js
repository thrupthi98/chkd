const mongoose = require("mongoose");

const SurgeryMasterSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    kywds: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model("surgery-master", SurgeryMasterSchema);