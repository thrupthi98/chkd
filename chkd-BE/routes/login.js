const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const Users = require("../models/user");
const Token = require("../models/token");

const token = require("../helper/token")

router.post('/', (req, res) => {
    console.log("Inside login")
    Users.findOne({ email: req.body.email, password: req.body.password }).then(result => {
        if (result == null || result == undefined) {
            res.status(400).json({
                message: "user not found",
                status: "BAD_REQUEST"
            })
        } else {
            var userID = token.createNewToken(result.email, result.password)
            var UUID = token.hashIt(userID)
            Token.create({
                token: userID,
                hash: UUID,
                role: result.role,
                uid: result.id
            }).then(response => {
                res.status(200).json({
                    message: "login successful",
                    status: "SUCCESS",
                    UUID: response.hash,
                    role: result.role
                })
            }).catch(error => {
                res.status(500).json({
                    message: "Problem creating token",
                    status: "FAILURE"
                })
            })
        }
    }).catch(err => {
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
            Users.findOne({ id: result.uid, password: req.body.current }).then(result => {
                if (result.password == req.body.new) {
                    res.status(400).json({
                        message: "password same as old",
                        status: "SAME_PASS"
                    })
                } else {
                    Users.findOneAndUpdate({ uid: result.uid, password: req.body.current }, { password: req.body.new }).then(result => {
                        res.status(200).json({
                            message: "Password successfully changes",
                            status: "SUCCESS"
                        })
                    })
                }
            }).catch(err => {
                res.status(404).json({
                    message: "password not found",
                    status: "NOT_FOUND"
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