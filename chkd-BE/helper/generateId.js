function createId() {
    var patientId = Math.floor(10000000 + Math.random() * 90000000);

    return patientId;
}

function createMail(id) {
    var email = id + "@gmail.com";

    return email;
}

module.exports = {
    createId: createId,
    createMail: createMail
}