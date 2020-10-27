const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken')

const Users = require("../models/user");
const surgery = require('../models/surgery');
const Token = require("../models/token");

const email = require("../helper/email");
const saltHash = require("../helper/saltHash");

router.post("/", (req, res) => {
    console.log("Inside register")
    Users.findOne({ email: req.body.email }).then(async(result) => {
        if (result == null || result == undefined) {
            var user_pass = nanoid(12)
            var hashPass = await saltHash.genSalt(user_pass);
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
                    password: hashPass
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

module.exports = router;