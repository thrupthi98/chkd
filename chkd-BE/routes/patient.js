const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const Patient = require("../models/patient");
const Users = require("../models/user")
const Token = require("../models/token")

const generateId = require("../helper/generateId");
const saltHash = require("../helper/saltHash");
const token = require("../helper/token");
const roles = require('../helper/roles').roles;


router.post("/", (req, res) => {
    Patient.findOne({ fname: req.body.fname, lname: req.body.lname, dob: req.body.dob, contact: req.body.contact }).then(async(result) => {
        if (result != null || result != undefined) {
            res.status(400).json({
                message: "Patient already exists",
                status: 'BAD_REQUEST'
            })
        } else {
            var patId = await generateId.createId();
            var patMail = await generateId.createMail(patId);
            var hashId = await saltHash.genSalt(patId.toString())
            Patient.create({
                id: nanoid(9),
                fname: req.body.fname,
                lname: req.body.lname,
                dob: req.body.dob,
                email: patMail,
                contact: req.body.contact,
                password: hashId,
            }).then(response => {
                res.status(200).json({
                    message: "login successful",
                    status: "SUCCESS",
                    id: response.id,
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json({
                    message: "Problem while creating the patient",
                    status: 'FAILURE'
                })
            })
        }
    })
})

router.post("/login", async(req, res) => {
    var emailId = req.body.id + "@gmail.com";
    Patient.findOne({ email: emailId }).then(async(result) => {
        if (result == null || result == undefined) {
            res.status(404).json({
                message: "Patient not found",
                status: 'NOT_FOUND'
            })
        } else {
            var loggedIn = await saltHash.validatePass(req.body.id, result.password)
            if (loggedIn) {
                var userID = token.createNewToken(result.id, "Patient")
                var UUID = token.hashIt(userID)
                Token.create({
                    token: userID,
                    hash: UUID,
                }).then(response => {
                    res.status(200).json({
                        message: "login successful",
                        status: "SUCCESS",
                        UUID: response.hash,
                        returnUrl: roles.filter(data => data.role == "Patient")[0].url[0]
                    })
                }).catch(error => {
                    console.log(error);
                    res.status(500).json({
                        message: "Problem creating token",
                        status: "FAILURE"
                    })
                })
            } else {
                console.log("hello")
                res.status(404).json({
                    message: "Patient not found",
                    status: 'NOT_FOUND'
                })
            }
        }
    })
})

router.get("/contact", (req, res) => {
    var phNo = req.header("x-auth-header");
    Patient.find({ contact: phNo }).then((result) => {
        if (result.length != 0) {
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