const express = require('express');
const router = express.Router();

const { nanoid } = require('nanoid');
const jwt = require("jsonwebtoken");

const Surgery = require("../models/surgery")
const Token = require("../models/token")
const Patient = require('../models/patient');
const Users = require('../models/user');

const generateId = require("../helper/generateId");

router.post("/:warning", (req, res) => {
    console.log(req.body.date + " " + req.body.time);
    console.log(req.params.warning)
    if (req.params.warning == 'beforeWarning') {
        Surgery.find({
            surgeon: req.body.surgeon,
            dateTime: {
                $gt: (new Date(req.body.date + " " + req.body.time).getTime() - (12 * 60 * 60 * 1000)),
                $lt: (new Date(req.body.date + " " + req.body.time).getTime() + (12 * 60 * 60 * 1000))
            },
            status: { $ne: 'Patient Discharged' }
        }).then(docresponse => {
            Surgery.find({
                pt_id: req.body.pt_id,
                dateTime: {
                    $gt: (new Date(req.body.date + " " + req.body.time).getTime() - (12 * 60 * 60 * 1000)),
                    $lt: (new Date(req.body.date + " " + req.body.time).getTime() + (12 * 60 * 60 * 1000))
                },
                status: { $ne: 'Patient Discharged' }
            }).then(async(patresponse) => {
                if (docresponse.length == 0 && patresponse == 0) {
                    Surgery.create({
                        id: nanoid(9),
                        pt_id: req.body.pt_id,
                        type: req.body.type,
                        dateTime: new Date(req.body.date + " " + req.body.time).getTime(),
                        venue: req.body.venue,
                        surgeon: req.body.surgeon,
                        prescription: req.body.prescription,
                        instructions: req.body.instructions,
                        status: req.body.status,
                        checkin: 0,
                        inSurgery: 0,
                        postSurgery: 0,
                        discharged: 0
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

                } else {
                    var pattimeObj = {};
                    var doctimeObj = {};
                    if (patresponse.length != 0) {
                        await patresponse.sort().forEach(ele => {
                            pattimeObj[ele.dateTime.toString()] = (new Date(req.body.date + " " + req.body.time).getTime() - (ele.dateTime))
                        })
                        var patmaxNeg = Math.max(...Object.values(pattimeObj).filter(item => item < 0))
                        var patminPos = Math.min(...Object.values(pattimeObj).filter(item => item > 0))
                        var patprev = Object.keys(pattimeObj).find(key => pattimeObj[key] == patmaxNeg)
                        var patnext = Object.keys(pattimeObj).find(key => pattimeObj[key] == patminPos)
                    }
                    if (docresponse.length != 0) {
                        await docresponse.sort().forEach(ele => {
                            doctimeObj[ele.dateTime.toString()] = (new Date(req.body.date + " " + req.body.time).getTime() - (ele.dateTime))
                        })
                        var docmaxNeg = Math.max(...Object.values(doctimeObj).filter(item => item < 0))
                        var docminPos = Math.min(...Object.values(doctimeObj).filter(item => item > 0))
                        var docprev = Object.keys(doctimeObj).find(key => doctimeObj[key] == docmaxNeg)
                        var docnext = Object.keys(doctimeObj).find(key => doctimeObj[key] == docminPos)
                    }
                    res.status(400).json({
                        message: "Surgery already exists",
                        status: "BAD_REQUEST",
                        patprev: patprev,
                        patnext: patnext,
                        docprev: docprev,
                        docnext: docnext
                    })
                }
            }).catch(error => {
                console.log(error)
                res.status(500).json({
                    message: "Problem occured while creating the surgery",
                    status: "FAILURE"
                })
            })
        }).catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Problem occured while creating the surgery",
                status: "FAILURE"
            })
        })
    } else if (req.params.warning == 'afterWarning') {
        Surgery.create({
            id: nanoid(9),
            pt_id: req.body.pt_id,
            type: req.body.type,
            dateTime: new Date(req.body.date + " " + req.body.time).getTime(),
            venue: req.body.venue,
            surgeon: req.body.surgeon,
            prescription: req.body.prescription,
            instructions: req.body.instructions,
            status: req.body.status,
            checkin: 0,
            inSurgery: 0,
            postSurgery: 0,
            discharged: 0
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
    }
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
            Surgery.find({ pt_id: userId, dateTime: { $gte: new Date().getTime() }, status: { $ne: "Patient Discharged" } }).sort({ dateTime: 1 }).then((response) => {
                Patient.findOne({ id: userId }, { fname: 1, lname: 1 }).then((result) => {
                    res.status(200).json({
                        message: "patient surgery fetch successfully",
                        status: 'SUCCESS',
                        data: response,
                        name: result.fname + " " + result.lname
                    })
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

router.get("/prevpatientsurgery", (req, res) => {
    var token = req.header("x-auth-header");
    Token.findOne({ hash: token }).then(async(result) => {
        if (result == null || result == undefined) {
            res.status(404).json({
                message: "No token Present",
                status: "NOT_FOUND"
            })
        } else {
            var userId = jwt.decode(result.token).id
            Surgery.find({
                $and: [
                    { $or: [{ pt_id: userId }] },
                    { $or: [{ status: "Patient Discharged" }, { dateTime: { $lt: new Date().getTime() } }] }
                ]
            }).sort({ dateTime: 1 }).then((response) => {
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

router.get("/surgeonsurgery", (req, res) => {
    var token = req.header("x-auth-header");
    var date = req.header("data");
    Token.findOne({ hash: token }).then(async(result) => {
        if (result == null || result == undefined) {
            res.status(404).json({
                message: "No token Present",
                status: "NOT_FOUND"
            })
        } else {
            var userId = jwt.decode(result.token).id
            Users.findOne({ id: userId }).then((response) => {
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
                                $gte: new Date(date).getTime(),
                                $lt: new Date(date).getTime() + (24 * 60 * 60 * 1000)
                            },
                            status: {
                                $ne: "Patient Discharged"
                            },
                            surgeon: response.fname + "" + response.lname
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
                        data: result,
                        name: response.fname + " " + response.lname
                    })
                }).catch((err) => {
                    console.log(err)
                    res.status(500).json({
                        message: "paroblem fetching patient surgery",
                        status: 'FAILURE'
                    })
                })
            }).catch((err) => {
                console.log(err)
                res.status(500).json({
                    message: "paroblem fetching patient surgery",
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

router.get("/surgerydates", (req, res) => {
    var token = req.header("x-auth-header");
    var date = req.header("data");
    Token.findOne({ hash: token }).then(async(result) => {
        if (result == null || result == undefined) {
            res.status(404).json({
                message: "No token Present",
                status: "NOT_FOUND"
            })
        } else {
            var userId = jwt.decode(result.token).id
            Users.findOne({ id: userId }).then((response) => {
                Surgery.find({ surgeon: response.fname + "" + response.lname }, { dateTime: 1 }).then((result) => {
                    res.status(200).json({
                        message: "Surgery fetched successfully",
                        status: "SUCCESS",
                        data: result,
                    })
                }).catch((err) => {
                    console.log(err)
                    res.status(500).json({
                        message: "paroblem fetching patient surgery",
                        status: 'FAILURE'
                    })
                })
            }).catch((err) => {
                console.log(err)
                res.status(500).json({
                    message: "paroblem fetching patient surgery",
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
    let result;
    var time;
    Surgery.findOne({ id: req.params.id }, { updatedAt: 1 }).then(response => {
        console.log(new Date(response.updatedAt).toLocaleString())
        switch (req.body.status) {
            case "Patient Checked in":
                time = parseFloat(((new Date().getTime() - new Date(response.updatedAt).getTime()) / 60000).toFixed(2));
                Surgery.findOneAndUpdate({ id: req.params.id }, {
                    status: req.body.status,
                    checkin: time
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
                break;
            case "Patient In Surgery":
                time = parseFloat(((new Date().getTime() - new Date(response.updatedAt).getTime()) / 60000).toFixed(2));
                Surgery.findOneAndUpdate({ id: req.params.id }, {
                    status: req.body.status,
                    inSurgery: time
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
                break;
            case "Post Surgery":
                time = parseFloat(((new Date().getTime() - new Date(response.updatedAt).getTime()) / 60000).toFixed(2));
                Surgery.findOneAndUpdate({ id: req.params.id }, {
                    status: req.body.status,
                    postSurgery: time
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
                break;
            case "Patient Discharged":
                time = parseFloat(((new Date().getTime() - new Date(response.updatedAt).getTime()) / 60000).toFixed(2));
                Surgery.findOneAndUpdate({ id: req.params.id }, {
                    status: req.body.status,
                    discharged: time
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
                break;
            default:
                console.log("Wrong status");
        }
        console.log(data);

    }).catch(error => {
        result = { 'success': false, 'message': 'Some Error', 'error': error };
        console.log(error);
    });

    // Surgery.findOneAndUpdate({ id: req.params.id }, {
    //     status: req.body.status
    // }).then(result => {
    //     console.log("Successfully updated the surgery");
    //     res.status(200).json({
    //         message: "Surgery Created successfully",
    //         status: "SUCCESS"
    //     })
    // }).catch(error => {
    //     res.status(500).json({
    //         message: "Problem occured while updating the surgery",
    //         status: "FAILURE"
    //     })
    // })
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