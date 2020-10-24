const updateStatus = (io, data) => {
    let result;
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
    Surgery.findOneAndUpdate({ id: data.id }, data).then(response => {
        console.log("Successfully updated the status");
        result = { 'success': true, 'message': 'Successfully updated the status', todo };
        io.emit('updateStatus', result);
    }).catch(error => {
        result = { 'success': false, 'message': 'Some Error', 'error': err };
        console.log(result);
    })
}

module.exports = { updateStatus: updateStatus }