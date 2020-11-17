const express = require('express');
const router = express.Router();
const Surgery = require("../models/surgery")

router.get("/average/:name", (req, res) => {
    Surgery.aggregate([
        { $match: { type: req.params.name } },
        { $group: { _id: null, avg_checkin: { $avg: "$checkin" }, avg_Insurgery: { $avg: "$inSurgery" }, avg_postSurgery: { $avg: "$postSurgery" }, avg_discharged: { $avg: "$discharged" } } }
    ]).then(response => {
        res.status(200).json({
            message: "Data Retrieved successfully",
            status: "SUCCESS",
            data: response
        })
    }).catch(err => {
        res.status(500).json({
            message: "Problem while retrieving data",
            status: "FAILURE",
            data: response
        })
    })
})

router.get("/min/:name", (req, res) => {
    Surgery.aggregate([
        { $match: { type: req.params.name } },
        { $group: { _id: null, min_checkin: { $min: "$checkin" }, min_Insurgery: { $min: "$inSurgery" }, min_postSurgery: { $min: "$postSurgery" }, min_discharged: { $min: "$discharged" } } }
    ]).then(response => {
        res.status(200).json({
            message: "Data Retrieved successfully",
            status: "SUCCESS",
            data: response
        })
    }).catch(err => {
        res.status(500).json({
            message: "Problem while retrieving data",
            status: "FAILURE",
            data: response
        })
    })
})

router.get("/max/:name", (req, res) => {
    Surgery.aggregate([
        { $match: { type: req.params.name } },
        { $group: { _id: null, max_checkin: { $max: "$checkin" }, max_Insurgery: { $max: "$inSurgery" }, max_postSurgery: { $max: "$postSurgery" }, max_discharged: { $max: "$discharged" } } }
    ]).then(response => {
        res.status(200).json({
            message: "Data Retrieved successfully",
            status: "SUCCESS",
            data: response
        })
    }).catch(err => {
        res.status(500).json({
            message: "Problem while retrieving data",
            status: "FAILURE",
            data: response
        })
    })
})


module.exports = router;