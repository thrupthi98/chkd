var jwt = require('jsonwebtoken');
var sha1 = require('sha1');

function createNewToken(id, password) {
    return jwt.sign({
        id: id,
        password: password
    }, "login@181219")
}

function hashIt(token) {
    return sha1(token)
}

module.exports = {
    createNewToken: createNewToken,
    hashIt: hashIt
}