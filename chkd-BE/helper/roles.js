var roles = [
    { role: "Admin", url: ["/admin", "/users", "/surgery", "/surgeon"] },
    { role: "Pre-op Co-ordinator", url: ["/pre-op"] },
    { role: "Patient", url: [] }
]

function authorize(role, url) {
    var count = 0;
    return new Promise((resolve, reject) => {
        for (var data of roles) {
            if (data.role == role) {
                for (var ele of data.url) {
                    if (url == ele) {
                        count++;
                        break;
                    }
                }
            }
        }
        if (count != 0) {
            resolve(true)
            console.log("authorised")
        } else {
            resolve(false)
            console.log("un-authorised")
        }
    })
}

module.exports = {
    authorize: authorize
}