const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const Surgery = require("../models/surgery")
const firebase = require('../helper/firebase');
const { response } = require('express');

const updateStatus = (io, data) => {
    let result;
    var time ;
    Surgery.findOne({id: data.id},{updatedAt :1}).then(response =>{
        console.log(new Date(response.updatedAt).toLocaleString())
        switch (data.status){
            case "Patient Checked in":
                data.checkin = parseFloat(((new Date().getTime() - new Date(response.updatedAt).getTime())/ 60000).toFixed(2));
                break;
            case "Patient In Surgery":
                data.inSurgery = parseFloat(((new Date().getTime() - new Date(response.updatedAt).getTime())/ 60000).toFixed(2));
                break;
            case "Post Surgery":
                data.postSurgery = parseFloat(((new Date().getTime() - new Date(response.updatedAt).getTime())/ 60000).toFixed(2));
                break;
            case "Patient Discharged":
                data.discharged = parseFloat(((new Date().getTime() - new Date(response.updatedAt).getTime())/ 60000).toFixed(2));
                break;
            default:
                console.log("Wrong status");
        }
        console.log(data);
        Surgery.findOneAndUpdate({ id: data.id }, data).then(response => {
            console.log("Successfully updated the status");
            result = { 'success': true, 'message': 'Successfully updated the status', 'data': data };
            io.emit(response.pt_id, result);
        }).catch(error => {
            result = { 'success': false, 'message': 'Some Error', 'error': error };
            console.log(error);
        })

    }).catch(error => {
        result = { 'success': false, 'message': 'Some Error', 'error': error };
        console.log(error);
    });
    
    
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