const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const Patient = require("../models/patient");
const Users = require("../models/user")
const Token = require("../models/token")

const generateId = require("../helper/generateId")
const token = require("../helper/token")

router.post("/", (req, res) => {
    Patient.findOne({ fname: req.body.fname, lname: req.body.lname, dob: req.body.dob, contact: req.body.contact }).then(result => {
        if (result != null || result != undefined) {
            res.status(400).json({
                message: "Patient already exists",
                status: 'BAD_REQUEST'
            })
        } else {
            var patId = generateId.createId();
            var patMail = generateId.createMail(patId);
            Patient.create({
                id: patId,
                fname: req.body.fname,
                lname: req.body.lname,
                dob: req.body.dob,
                email: patMail,
                contact: req.body.contact,
                password: nanoid(12)
            }).then(result => {
                Users.create({
                    id: patId,
                    fname: req.body.fname,
                    lname: req.body.lname,
                    dob: req.body.dob,
                    email: patMail,
                    contact: req.body.contact,
                    password: result.password,
                    role: "Patient"
                }).then(response => {
                    res.status(200).json({
                        message: "patient created successfully",
                        status: 'SUCCESS',
                        id: result.id
                    })
                }).catch(err => {
                    console.log(err)
                    res.status(500).json({
                        message: "Problem while creating the patient",
                        status: 'FAILURE'
                    })
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json({
                    message: "Problem while creating the patient",
                    status: 'FAILURE'
                })
            })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            message: "Problem while creating the patient",
            status: 'FAILURE'
        })
    })
})

router.get("/contact", (req, res) => {
    var phNo = req.header("x-auth-header");
    Patient.findOne({ contact: phNo }).then((result) => {
        if (result != null || result != undefined) {
            res.status(200).json({
                message: "patient details fetch successfully",
                status: 'SUCCESS',
                data: result
            })
        } else {
            res.status(404).json({
                message: "patient not created",
                status: 'NOT_FOUND',
            })
        }
    }).catch((err) => {
        res.status(500).json({
            message: "paroblem fetching patient details",
            status: 'FAILURE'
        })
    })
})

router.get("/id", (req, res) => {
    var patientId = req.header("x-auth-header");
    Patient.findOne({ id: patientId }).then((result) => {
        if (result != null || result != undefined) {
            res.status(200).json({
                message: "patient details fetch successfully",
                status: 'SUCCESS',
                data: result
            })
        } else {
            res.status(404).json({
                message: "patient not created",
                status: 'NOT_FOUND',
            })
        }
    }).catch((err) => {
        res.status(500).json({
            message: "paroblem fetching patient details",
            status: 'FAILURE'
        })
    })
})


// router.get("/patientbyid/:id", (req, res) => {
//     Patient.findOne({ id: req.params.id }).then((result) => {
//         res.status(200).json({
//             message: "patient details fetch successfully",
//             status: 'SUCCESS',
//             data: result,
//         })

//     }).catch((err) => {
//         res.status(500).json({
//             message: "paroblem fetching patient details",
//             status: 'FAILURE'
//         })
//     })
// })

module.exports = router;