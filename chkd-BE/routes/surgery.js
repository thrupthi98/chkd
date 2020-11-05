const express = require('express');
const router = express.Router();
const metaData = require('../metadata/config');
const db = metaData.dbUrl;

const { nanoid } = require('nanoid');
const jwt = require("jsonwebtoken");

const Surgery = require("../models/surgery")
const Token = require("../models/token")

const generateId = require("../helper/generateId")

router.post("/", (req, res) => {
    console.log(req.body.date + " " + req.body.time);
    Surgery.create({
        id: nanoid(9),
        pt_id: req.body.pt_id,
        type: req.body.type,
        dateTime: new Date(req.body.date + " " + req.body.time).getTime(),
        venue: req.body.venue,
        surgeon: req.body.surgeon,
        prescription: req.body.prescription,
        instructions: req.body.instructions,
        status: req.body.status
    }).then(result => {
        console.log("Successfully created the surgery");
        res.status(200).json({
            message: "Surgery Created successfully",
            status: "SUCCESS"
        })
    }).catch(error => {
        console.log(error)
        res.status(500).json({
            message: "Problem occured while creating the surgery",
            status: "FAILURE"
        })
    })
})

router.get("/upcoming", (req, res) => {
    Surgery.aggregate([{
            $lookup: {
                from: "patients",
                localField: "pt_id",
                foreignField: "id",
                as: "patientDetails"
            }
        },
        {
            $match: {
                dateTime: {
                    $gte: new Date().getTime()
                },
                status: {
                    $ne: "Patient Discharged"
                }
            }
        },
        {
            $sort: {
                dateTime: 1
            }
        }

    ]).then((result) => {
        res.status(200).json({
            message: "Surgery fetched successfully",
            status: "SUCCESS",
            data: result
        })
    }).catch(err => {
        res.status(500).json({
            message: "Problem occured while fetching the surgery",
            status: "FAILURE"
        })
    })

})

router.get("/previous", (req, res) => {
    Surgery.aggregate([{
            $lookup: {
                from: "patients",
                localField: "pt_id",
                foreignField: "id",
                as: "patientDetails"
            }
        },
        {
            $match: {
                $or: [{
                        dateTime: {
                            $lt: new Date().getTime()
                        }
                    },
                    {
                        status: {
                            $eq: "Patient Discharged"
                        }
                    }
                ]
            }
        },
        {
            $sort: {
                dateTime: 1
            }
        }

    ]).then((result) => {
        res.status(200).json({
            message: "Surgery fetched successfully",
            status: "SUCCESS",
            data: result
        })
    }).catch(err => {
        res.status(500).json({
            message: "Problem occured while fetching the surgery",
            status: "FAILURE"
        })
    })
})

router.get("/getId/:id", (req, res) => {
    Surgery.findOne({ id: req.params.id }).then(result => {
        console.log("Successfully fetched the surgery by id");
        res.status(200).json({
            message: "Surgery fetched successfully",
            status: "SUCCESS",
            data: result
        })
    }).catch(err => {
        res.status(500).json({
            message: "Problem occured while fetching the surgery",
            status: "FAILURE"
        })
    })
})


router.get("/patientsurgery", (req, res) => {
    var token = req.header("x-auth-header");
    Token.findOne({ hash: token }).then(async(result) => {
        if (result == null || result == undefined) {
            res.status(404).json({
                message: "No token Present",
                status: "NOT_FOUND"
            })
        } else {
            var userId = jwt.decode(result.token).id
            Surgery.aggregate([{
                    $lookup: {
                        from: "patients",
                        localField: "pt_id",
                        foreignField: "id",
                        as: "patientDetails"
                    }
                },
                {
                    $match: {
                        pt_id: {
                            $eq: userId
                        }
                    }
                },
                {
                    $sort: {
                        dateTime: 1
                    }
                },
                {
                    $unset: [
                        "patientDetails.id",
                        "patientDetails.dob",
                        "patientDetails.email",
                        "patientDetails.contact",
                        "patientDetails.password",
                        "patientDetails.createdAt",
                        "patientDetails.updatedAt",
                    ]

                }

            ]).then((response) => {
                res.status(200).json({
                    message: "patient surgery fetch successfully",
                    status: 'SUCCESS',
                    data: response,
                })
            }).catch((err) => {
                console.log(err)
                res.status(500).json({
                    message: "paroblem fetching patient surgery details",
                    status: 'FAILURE'
                })
            })
        }
    }).catch((err) => {
        console.log(err)
        res.status(500).json({
            message: "paroblem fetching patient surgery",
            status: 'FAILURE'
        })
    })
})

router.put("/update/:id", (req, res) => {
    Surgery.findOneAndUpdate({ id: req.params.id }, {
        id: req.params.id,
        type: req.body.type,
        date: req.body.date,
        time: req.body.time,
        venue: req.body.venue,
        surgeon: req.body.surgeon,
        patientAge: req.body.patientAge,
        prescription: req.body.prescription,
        instructions: req.body.instructions,
        status: req.body.status
    }).then(result => {
        console.log("Successfully updated the surgery");
        res.status(200).json({
            message: "Surgery Created successfully",
            status: "SUCCESS"
        })
    }).catch(error => {
        res.status(500).json({
            message: "Problem occured while updating the surgery",
            status: "FAILURE"
        })
    })
})


router.put("/statusUpdate/:id", (req, res) => {
    Surgery.findOneAndUpdate({ id: req.params.id }, {
        status: req.body.status
    }).then(result => {
        console.log("Successfully updated the surgery");
        res.status(200).json({
            message: "Surgery Created successfully",
            status: "SUCCESS"
        })
    }).catch(error => {
        res.status(500).json({
            message: "Problem occured while updating the surgery",
            status: "FAILURE"
        })
    })
})

router.delete('/delete/:id', (req, res) => {
    Surgery.findOneAndRemove({ id: req.params.id }).then(data => {
        res.status(200).json({
            message: "Surgery deleted successfully",
            status: "SUCCESS"
        })
    }).catch(error => {
        res.status(500).json({
            message: "Problem occured while deleting the surgery",
            status: "FAILURE"
        })
    })
})

module.exports = router;