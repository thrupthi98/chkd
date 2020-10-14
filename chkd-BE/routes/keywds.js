const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const SurgeryMaster = require("../models/keywds")

router.get("/", (req, res) => {
    SurgeryMaster.find().then(result => {
        res.status(200).json({
            message: "Keywords fetched successfully",
            status: "SUCCESS",
            data: result
        })
    }).catch(err => {
        res.status(500).json({
            message: "There was an error fetching keywords",
            status: "FAILURE",
        })
    })
})

router.put("/", (req, res) => {
    SurgeryMaster.findOneAndUpdate({ type: req.body.type }, { type: req.body.type, kywds: req.body.kywds }).then((result) => {
        console.log("Successfully updated")
        res.status(200).json({
            message: "Keyword added successfully",
            status: "SUCCESS",
            data: result
        })
    }).catch(err => {
        console.log("error while updating")
        res.status(500).json({
            message: "There was an error while adding keywords",
            status: "FAILURE",
        })
    })
})

module.exports = router;