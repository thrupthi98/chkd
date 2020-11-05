const express = require('express');
const router = express.Router();

const firebase = require('../helper/firebase');

router.get('/', async(req, res) => {
    var uid = req.header("x-auth-header");
    var result = await firebase.getMessages(uid).catch(err => console.log(err))
    if (result != null || result != undefined) {
        res.status(200).json({
            message: "Messages fetched sucessfully",
            status: "SUCCESS",
            messageHistory: result
        })
    } else {
        res.status(500).json({
            message: "There was some problem fetching the messages",
            status: "FAILURE"
        })
    }
})

module.exports = router;