const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const SurgeryType = require("../models/surgeryType")

router.post("/", (req, res) => {
    SurgeryType.create({
        type: req.body.type,
        description: req.body.description,
        prep: req.body.prep,
        visit: req.body.visit,
        homeCare: req.body.homeCare,
        concern: req.body.concern,
        followUp: req.body.followUp,
        videos: req.body.videos,
    }).then(result => {
        console.log("Successfully created the surgery type");
        res.status(200).json({
            message: "Surgery Created successfully",
            status: "SUCCESS"
        })
    }).catch(error => {
        console.log(error)
        res.status(500).json({
            message: "Problem occured while creating the surgery type",
            status: "FAILURE"
        })
    })
})

router.get("/", (req, res) => [
    SurgeryType.find({}, { type: 1 }).then((result) => {
        res.status(200).json({
            message: "Surgery fetched successfully",
            status: "SUCCESS",
            data: result
        })
    }).catch((err) => {
        res.status(500).json({
            message: "Problem occured while fetching the surgery type",
            status: "FAILURE"
        })
    })
])

module.exports = router;