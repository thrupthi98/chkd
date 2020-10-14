const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const Surgeon = require("../models/surgeon");

router.post("/", (req, res) => {
    Surgeon.findOne({ email: req.body.email }).then(result => {
        if (result == null || result == undefined) {
            Surgeon.create({
                id: nanoid(9),
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                contact: req.body.contact,
            }).then(result => {
                res.status(200).json({
                    message: "Surgeon has been created",
                    status: 'SUCCESS'
                })
            }).catch(err => {
                res.status(500).json({
                    message: "Problem creating the surgeon",
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

router.get("/", (req, res) => [
    Surgeon.find({}, { fname: 1, lname: 1, id: 1 }).then((result) => {
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