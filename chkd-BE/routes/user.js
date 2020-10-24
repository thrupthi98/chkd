const { request } = require('express');
const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const Users = require("../models/user");
const surgery = require('../models/surgery');
const Token = require("../models/token");

const email = require("../helper/email");

router.post("/", (req, res) => {
    console.log("Inside register")
    Users.findOne({ email: req.body.email }).then(async(result) => {
        if (result == null || result == undefined) {
            var user_pass = nanoid(12)
            var response = await email.registerUser(req.body.role, req.body.email, user_pass)
            if (response == true) {
                Users.create({
                    id: nanoid(9),
                    fname: req.body.fname,
                    lname: req.body.lname,
                    dob: req.body.dob,
                    email: req.body.email,
                    contact: req.body.contact,
                    role: req.body.role,
                    password: user_pass
                }).then(result => {
                    res.status(200).json({
                        message: "mail has been sent",
                        status: 'SUCCESS'
                    })
                }).catch(err => {
                    res.status(500).json({
                        message: "mail not sent",
                        status: 'FAILURE'
                    })
                })
            } else {
                res.status(500).json({
                    message: "mail not sent",
                    status: 'FAILURE'
                })
            }
        } else {
            res.status(400).json({
                message: "email already present",
                status: 'BAD_REQUEST'
            })
        }
    })
})


router.get("/patientdetails", (req, res) => {
    var token = req.header("x-auth-header");
    Token.findOne({ hash: token }).then(async(result) => {
        if (result == null || result == undefined) {
            res.status(404).json({
                message: "No token Present",
                status: "NOT_FOUND"
            })
        } else {
            surgery.find({ pt_id: result.uid }).then((response) => {
                res.status(200).json({
                    message: "patient details fetch successfully",
                    status: 'SUCCESS',
                    data: response,
                })
            }).catch((err) => {
                res.status(500).json({
                    message: "paroblem fetching surgery details",
                    status: 'FAILURE'
                })
            })
        }
    }).catch((err) => {
        res.status(500).json({
            message: "paroblem fetching patient details",
            status: 'FAILURE'
        })
    })
})

router.get("/patients/:contact", (req, res) => {
    Users.findOne({ role: "Patient", contact: req.params.contact }).then((result) => {
        var details = result;
        if (result != null || result != undefined) {
            surgery.find({ pt_id: result.id, status: { $ne: "Patient Discharged" } }).then((result) => {
                if (result.length == 0) {
                    res.status(200).json({
                        message: "patient details fetch successfully",
                        status: 'SUCCESS',
                        data: details
                    })
                } else {
                    res.status(400).json({
                        message: "Patient already has a surgery created",
                        status: 'BAD_REQUEST',
                    })
                }
            })
        } else {
            res.status(200).json({
                message: "patient not created",
                status: 'SUCCESS',
            })
        }
    }).catch((err) => {
        res.status(500).json({
            message: "paroblem fetching patient details",
            status: 'FAILURE'
        })
    })
})

router.get("/patientbyid/:id", (req, res) => {
    Users.findOne({ role: "Patient", id: req.params.id }).then((result) => {
        res.status(200).json({
            message: "patient details fetch successfully",
            status: 'SUCCESS',
            data: result,
        })

    }).catch((err) => {
        res.status(500).json({
            message: "paroblem fetching patient details",
            status: 'FAILURE'
        })
    })
})


module.exports = router;