const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

const Token = require("../models/token")

const role = require("../helper/roles")

router.get('/', async(req, res) => {
    console.log("Inside check")
    var token = req.header("x-auth-header");
    var url = req.header("URL");
    Token.findOne({ hash: token }).then(async(result) => {
        if (result == null || result == undefined) {
            res.status(404).json({
                message: "No token Present",
                status: "NOT_FOUND"
            })
        } else {
            var userRole = jwt.decode(result.token).role
            var response = await role.authorize(userRole, url);
            if (response == true) {
                res.status(200).json({
                    message: "Authorised user",
                    status: "SUCCESS"
                })
            } else {
                res.status(401).json({
                    message: "Un-authorised user",
                    status: "UN_AUTHORISED"
                })
            }
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            message: "Error checking the token",
            status: "FAILURE"
        })
    })
})

module.exports = router