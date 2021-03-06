var roles = [
    { role: "Admin", url: ["/admin", "/users", "/surgery", "/surgeon", "/analytics"] },
    { role: "Pre-op Co-ordinator", url: ["/pre-op"] },
    { role: "Patient", url: ["/patient"] },
    { role: "Surgeon", url: ["/pre-op"] }
]

function authorize(role, url) {
    var count = 0;
    return new Promise((resolve, reject) => {
        if (roles.filter(a => a.role == role)[0].url.includes(url)) {
            resolve(true)
            console.log("authorised")
        } else {
            resolve(false)
            console.log("un-authorised")
        }
    })
}

module.exports = {
    authorize: authorize,
    roles: roles
}