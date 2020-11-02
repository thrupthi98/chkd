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
    var result = await firebase.storeMessage(data)
    if (result) {
        console.log("Successfully sent message");
        response = { 'success': true, 'message': 'Successfully sent message', 'data': data };
        io.emit(data.toId, response);
    } else {
        res.status(500).json({
            message: "There was some problem storing the messages",
            status: "FAILURE"
        })
    }
}

module.exports = {
    updateStatus: updateStatus,
    sendMessage: sendMessage
}