const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const jwt = require("jsonwebtoken")

const Users = require("../models/user");
const Token = require("../models/token");
const roles = require('../helper/roles').roles;

const token = require("../helper/token")
const saltHash = require("../helper/saltHash")


router.post('/', (req, res) => {
    console.log("Inside login")
    Users.findOne({ email: req.body.email }).then(async(result) => {
        if (result == null || result == undefined) {
            res.status(400).json({
                message: "user not found",
                status: "BAD_REQUEST"
            })
        } else {
            var fullName = result.fname + " " + result.lname;
            var DOB = result.dob.split('T')[0];
            var phone = result.contact;
            var validateUser = await saltHash.validatePass(req.body.password, result.password)
            if (validateUser) {
                var userID = token.createNewToken(result.id, result.role)
                var UUID = token.hashIt(userID)
                Token.create({
                    token: userID,
                    hash: UUID,
                }).then(response => {
                    res.status(200).json({
                        message: "login successful",
                        status: "SUCCESS",
                        UUID: response.hash,
                        name: fullName,
                        dob: DOB,
                        contact: phone,
                        returnUrl: roles.filter(data => data.role == result.role)[0].url[0]
                    })
                }).catch(error => {
                    console.log(error);
                    res.status(500).json({
                        message: "Problem creating token",
                        status: "FAILURE"
                    })
                })
            } else {
                res.status(500).json({
                    message: "Problem during user login",
                    status: "FAILURE"
                })
            }
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            message: "Problem during user login",
            status: "FAILURE"
        })
    })
})

router.put('/', (req, res) => {
    var token = req.header("x-auth-header");
    Token.findOne({ hash: token }).then(result => {
        if (result == null || result == undefined) {
            res.status(401).json({
                message: "No token Present",
                status: "UNAUTHORISED"
            })
        } else {
            var userId = jwt.decode(result.token).id
            Users.findOne({ id: userId }).then(async(response) => {
                var validateUser = await saltHash.validatePass(req.body.current, response.password)
                if (validateUser) {
                    var checkPass = await saltHash.validatePass(req.body.new, response.password)
                    if (checkPass) {
                        res.status(400).json({
                            message: "password same as old",
                            status: "SAME_PASS"
                        })
                    } else {
                        var genPass = await saltHash.genSalt(req.body.new)
                        Users.findOneAndUpdate({ uid: response.uid, password: response.password }, { password: genPass }).then(result => {
                            res.status(200).json({
                                message: "Password successfully changes",
                                status: "SUCCESS"
                            })
                        })
                    }
                } else {
                    res.status(404).json({
                        message: "password not found",
                        status: "NOT_FOUND"
                    })
                }
            }).catch(err => {
                res.status(500).json({
                    message: "error while finding id",
                    status: "FAILURE"
                })
            })
        }
    }).catch(err => {
        res.status(500).json({
            message: "error finding token",
            status: "FAILURE"
        })
    })
})

router.delete('/logout/:id', (req, res) => {
    Token.findOneAndRemove({ hash: req.params.id }).then((result) => {
        res.status(200).json({
            message: "login successful",
            status: "SUCCESS",
        })
    }).catch(err => {
        res.status(500).json({
            message: "Problem during admin login",
            status: "FAILURE"
        })
    })
})

module.exports = router;