var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
        user: "trupthin.murthy@gmail.com",
        pass: "Muffin@98",
    },
});

async function registerUser(role, email, password) {
    var mailOptions = {
        from: 'trupthin.murthy@gmail.com',
        to: email,
        subject: 'CHKD Registration Successful',
        text: 'Hello, \nYou have been successfully registered as ' + role + ' to CHKD. Please use the below credentials to login and reset the password. \n' + 'Credentials: \n' + 'Email: ' + email + '\n Password: ' + password
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                resolve(false)
            } else {
                console.log('Email sent');
                resolve(true)
            }
        })

    })
}

module.exports = { registerUser: registerUser }