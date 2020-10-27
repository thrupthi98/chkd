var jwt = require('jsonwebtoken');
var sha1 = require('sha1');

function createNewToken(id, role) {
    return jwt.sign({
        id: id,
        role: role
    }, "login@181219")
}

function hashIt(token) {
    return sha1(token)
}

module.exports = {
    createNewToken: createNewToken,
    hashIt: hashIt
}