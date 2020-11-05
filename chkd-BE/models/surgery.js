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
    },
    checkin:{
        tyep: Number,
        default : 0,
    },
    inSurgery:{
        tyep: Number,
        default : 0,
    },
    postSurgery:{
        tyep: Number,
        default : 0,
    },
    discharged:{
        tyep: Number,
        default : 0,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("surgery", SurgerySchema);