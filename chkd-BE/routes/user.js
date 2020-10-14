const { request } = require('express');
const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const Users = require("../models/user");

const email = require("../helper/email")

router.post("/", (req, res) => {
    console.log("Inside register")
    Users.findOne({ email: req.body.email }).then(result => {
        if (result == null || result == undefined) {
            Users.create({
                id: nanoid(9),
                fname: req.body.fname,
                lname: req.body.lname,
                dob: req.body.dob,
                email: req.body.email,
                contact: req.body.contact,
                role: req.body.role,
                password: nanoid(12)
            }).then(async(result) => {
                var response = await email.registerUser(result.role, result.email, result.password)
                if (response == true) {
                    res.status(200).json({
                        message: "mail has been sent",
                        status: 'SUCCESS'
                    })
                } else {
                    res.status(500).json({
                        message: "mail not sent",
                        status: 'FAILURE'
                    })
                }
            }).catch(err => {
                res.status(500).json({
                    message: "mail not sent",
                    status: 'FAILURE'
                })
            })
        } else {
            res.status(400).json({
                message: "email already present",
                status: 'BAD_REQUEST'
            })
        }
    })
})

router.get("/patients", (req, res) => {
    Users.find({ role: "Patient" }, { fname: 1, lname: 1, id: 1 }).then((result) => {
        res.status(200).json({
            message: "patient details fetch successfully",
            status: 'SUCCESS',
            data: result
        })
    }).catch((err) => {
        res.status(500).json({
            message: "paroblem fetching patient details",
            status: 'FAILURE'
        })
    })
})

module.exports = router;