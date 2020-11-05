const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const Surgery = require("../models/surgery")
const firebase = require('../helper/firebase');


const updateStatus = (io, data) => {
    let result;
<<<<<<< HEAD
    // Todo.findOneAndUpdate({ _id:T.id }, T, { new:true }, (err,todo) => {
    //   if(err){
    //   result = {'success':false,'message':'Some Error','error':err};
    //   console.log(result);
    //   }
    //   else{
    //    result = {'success':true,'message':'Todo Updated Successfully',todo};
    //    io.emit('TodoUpdated', result);
    //   }
    // })
    console.log(data);
=======
>>>>>>> e0ecf151c912b6730cac711183c29119e7f45e60
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