const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const Surgery = require("../models/surgery")
const firebase = require('../helper/firebase');


const updateStatus = (io, data) => {
    let result;
    Surgery.findOneAndUpdate({ id: data.id }, data).then(response => {
        console.log("Successfully updated the status");
        result = { 'success': true, 'message': 'Successfully updated the status', 'data': data };
        io.emit(response.pt_id, result);
    }).catch(error => {
        result = { 'success': false, 'message': 'Some Error', 'error': error };
        console.log(error);
    })
}

const sendMessage = async(io, data) => {
    let response;
    if (data.toId != 999) {
        Surgery.findOne({ id: data.toId }).then(async(surgery) => {
            var result = await firebase.storeMessage(data.toId, data)
            if (result) {
                console.log("Successfully sent message");
                response = { 'success': true, 'message': 'Successfully sent message', 'data': data };
                io.emit(surgery.pt_id, response);
            } else {
                res.status(500).json({
                    message: "There was some problem storing the messages",
                    status: "FAILURE"
                })
            }
        }).catch(err => {
            res.status(500).json({
                message: "There was some problem storing the messages",
                status: "FAILURE"
            })
        })
    } else {
        data.toId = data.toId.toString();
        var result = await firebase.storeMessage(data.fromId, data)
        if (result) {
            console.log("Successfully sent message");
            response = { 'success': true, 'message': 'Successfully sent message', 'data': data };
            io.emit(999, response);
        } else {
            res.status(500).json({
                message: "There was some problem storing the messages",
                status: "FAILURE"
            })
        }
    }
}

module.exports = {
    updateStatus: updateStatus,
    sendMessage: sendMessage
}