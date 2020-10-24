const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const Surgery = require("../models/surgery")
const Users = require("../models/user")

router.post("/", (req, res) => {
    if (req.body.pt_id == "") {
        var user_pass = nanoid(12);
        Users.create({
            id: nanoid(9),
            fname: req.body.fname,
            lname: req.body.lname,
            dob: req.body.dob,
            email: req.body.email,
            contact: req.body.contact,
            role: "Patient",
            password: user_pass
        }).then(result => {
            console.log(result)
            Surgery.create({
                id: nanoid(9),
                pt_id: result.id,
                type: req.body.type,
                dateTime: new Date(req.body.date + " " + req.body.time).getTime(),
                venue: req.body.venue,
                surgeon: req.body.surgeon,
                patient: req.body.patient,
                prescription: req.body.prescription,
                instructions: req.body.instructions,
                status: req.body.status
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
        }).catch(error => {
            res.status(500).json({
                message: "Problem occured while creating the patient",
                status: "FAILURE"
            })
        })
    } else {
        Surgery.create({
            id: nanoid(9),
            pt_id: req.body.pt_id,
            type: req.body.type,
            dateTime: new Date(req.body.date + " " + req.body.time).getTime(),
            venue: req.body.venue,
            surgeon: req.body.surgeon,
            patient: req.body.patient,
            prescription: req.body.prescription,
            instructions: req.body.instructions,
            status: req.body.status
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
    }
})

router.get("/upcoming", (req, res) => {
    Surgery.find({ dateTime: { $gte: new Date().getTime() }, status: { $ne: "Patient Discharged" } }).sort({ dateTime: 1 }).then(result => {
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

router.get("/previous", (req, res) => {
    Surgery.find({ $or: [{ dateTime: { $lt: new Date().getTime() } }, { status: { $eq: "Patient Discharged" } }] }).sort({ dateTime: 1 }).then(result => {
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
        status: req.body.status
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