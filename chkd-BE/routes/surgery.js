const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const Surgery = require("../models/surgery")

router.post("/", (req, res) => {
    Surgery.create({
        id: nanoid(9),
        type: req.body.type,
        date: req.body.date,
        time: req.body.time,
        venue: req.body.venue,
        surgeon: req.body.surgeon,
        patient: req.body.patient,
        patientAge: req.body.patientAge,
        prescription: req.body.prescription,
        instructions: req.body.instructions,
    }).then(result => {
        console.log("Successfully created the surgery");
        res.status(200).json({
            message: "Surgery Created successfully",
            status: "SUCCESS"
        })
    }).catch(error => {
        res.status(500).json({
            message: "Problem occured while creating the surgery",
            status: "FAILURE"
        })
    })
})

router.get("/", (req, res) => {
    Surgery.find().then(result => {
        console.log("Successfully fetched the surgery");
        res.status(200).json({
            message: "Surgery fetched successfully",
            status: "SUCCESS",
            data: result
        })
    }).catch(err => {
        res.status(500).json({
            message: "Problem occured while fetching the surgery",
            status: "FAILURE"
        })
    })
})
router.get("/getId/:id", (req, res) => {
    Surgery.findOne({ id: req.params.id }).then(result => {
        console.log("Successfully fetched the surgery by id");
        res.status(200).json({
            message: "Surgery fetched successfully",
            status: "SUCCESS",
            data: result
        })
    }).catch(err => {
        res.status(500).json({
            message: "Problem occured while fetching the surgery",
            status: "FAILURE"
        })
    })
})

router.put("/update/:id", (req, res) => {
    Surgery.findOneAndUpdate({ id: req.params.id }, {
        id: req.params.id,
        type: req.body.type,
        date: req.body.date,
        time: req.body.time,
        venue: req.body.venue,
        surgeon: req.body.surgeon,
        patient: req.body.patient,
        patientAge: req.body.patientAge,
        prescription: req.body.prescription,
        instructions: req.body.instructions,
    }).then(result => {
        console.log("Successfully updated the surgery");
        res.status(200).json({
            message: "Surgery Created successfully",
            status: "SUCCESS"
        })
    }).catch(error => {
        res.status(500).json({
            message: "Problem occured while updating the surgery",
            status: "FAILURE"
        })
    })
})

router.delete('/delete/:id', (req, res) => {
    Surgery.findOneAndRemove({ id: req.params.id }).then(data => {
        res.status(200).json({
            message: "Surgery deleted successfully",
            status: "SUCCESS"
        })
    }).catch(error => {
        res.status(500).json({
            message: "Problem occured while deleting the surgery",
            status: "FAILURE"
        })
    })
})

module.exports = router;