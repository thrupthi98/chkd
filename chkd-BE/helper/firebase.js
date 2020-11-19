const admin = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyBq1zOZCP7CAsuxhoQcEhyBVle1fTY3SHc",
    authDomain: "chkdsurgery-34cc1.firebaseapp.com",
    databaseURL: "https://chkdsurgery-34cc1.firebaseio.com",
    projectId: "chkdsurgery-34cc1",
    storageBucket: "chkdsurgery-34cc1.appspot.com",
    messagingSenderId: "712412435401",
    appId: "1:712412435401:web:55fe959acc77af04368e18",
    measurementId: "G-P85N62C5RK"
};

// var firebaseConfig = {
//     apiKey: "AIzaSyBof-xhNDwJqY4hEfs0iE9fMWFc0f9MNRQ",
//     authDomain: "complaintform-aea71.firebaseapp.com",
//     databaseURL: "https://complaintform-aea71.firebaseio.com",
//     projectId: "complaintform-aea71",
//     storageBucket: "complaintform-aea71.appspot.com",
//     messagingSenderId: "936948767610",
//     appId: "1:936948767610:web:31316815fcf527605d54c3"
// };

admin.initializeApp(firebaseConfig);
const db = admin.firestore();

// function createUser(email, pass, data) {
//     return new Promise((resolve, reject) => {
//         admin.auth().createUserWithEmailAndPassword(email, pass.toString()).then(res => {
//             db.collection("users").doc(res.user.uid).set({
//                 UT: "patient",
//                 aboutMe: "",
//                 chattingWith: null,
//                 createdAt: new Date().getTime().toString(),
//                 id: res.user.uid,
//                 nickname: data.fname + " " + data.lname,
//                 photoUrl: "https://i.stack.imgur.com/ZQT8Z.png",
//                 pushToken: ""
//             }).then(result => {
//                 resolve(res.user.uid);
//             }).catch(error => {
//                 console.log(error);
//                 reject(error);
//             })
//         }).catch(function(error) {
//             reject(error);
//         })
//     })
// }

function fetchUsers() {
    return new Promise(async(resolve, reject) => {
        var patientsData = []
        var patients = await db.collection('users').where('UT', '==', 'patient').get()
        patients.forEach(doc => {
            patientsData.push(doc.data());
        });
        resolve(patientsData)
    })

}

function storeMessage(id, message) {
    return new Promise(async(resolve, reject) => {
        db.collection("messages").doc(id).collection(id).doc(new Date(message.dateSent).getTime().toString()).set({
            type: message.type,
            idFrom: message.fromId,
            idTo: message.toId,
            content: message.message,
            timestamp: new Date(message.dateSent).getTime().toString(),
        }).then(async(result) => {
            const doc = await db.collection("status").doc(message.fromId + "," + message.toId).get();
            if (doc.data() == undefined) {
                var count = 1
                db.collection("status").doc(message.fromId + "," + message.toId).set({
                    count: count
                }).then(response =>
                    resolve(true)
                )
            } else {
                var count = doc.data().count + 1;
                db.collection("status").doc(message.fromId + "," + message.toId).set({
                    count: count
                }).then(response =>
                    resolve(true)
                )
            }
        }).catch(error => {
            console.log(error);
            reject(error);
        })
    })
}

async function mobileIncrementFunction(message) {
    const doc = await db.collection("status").doc(message.fromId + "," + message.toId).get();
    if (doc.data() == undefined) {
        var count = 1
        db.collection("status").doc(message.fromId + "," + message.toId).set({
            count: count
        }).then(response =>
            resolve(true)
        )
    } else {
        var count = doc.data().count + 1;
        db.collection("status").doc(message.fromId + "," + message.toId).set({
            count: count
        }).then(response =>
            resolve(true)
        )
    }
}

function getAllMsgsCnt() {
    var response = []
    return new Promise(async(resolve, reject) => {
        const doc = await db.collection("status").get();
        if (!doc.empty) {
            doc.forEach(doc => {
                var dict = {}
                dict['id'] = doc.id;
                dict['count'] = doc.data().count
                response.push(dict)
            });
            resolve(response)
        } else {
            reject(0)
        }
    })
}

function clearMsgsCnt(id) {
    return new Promise(async(resolve, reject) => {
        const doc = await db.collection("status").doc(id).get();
        if (doc.data() == undefined) {
            console.log("No data")
        } else {
            db.collection("status").doc(id).set({
                count: 0
            }).then(response =>
                resolve(true)
            ).catch(error => {
                console.log(error);
                reject(error);
            })
        }
    })
}

function getMessages(uid) {
    return new Promise(async(resolve, reject) => {
        var patientsMessages = []
        var messages = await db.collection('messages').doc(uid).collection(uid).get()
        messages.forEach(doc => {
            if (doc.data().status == 'unread') {
                doc.set({
                    type: doc.data().type,
                    idFrom: doc.data().fromId,
                    idTo: doc.data().toId,
                    content: doc.data().message,
                    timestamp: new Date(doc.data().dateSent).getTime().toString(),
                    status: "read"
                })
            }
            patientsMessages.push(doc.data());
        });
        resolve(patientsMessages)
    })
}

module.exports = {
    fetchUsers: fetchUsers,
    storeMessage: storeMessage,
    getMessages: getMessages,
    getAllMsgsCnt: getAllMsgsCnt,
    clearMsgsCnt: clearMsgsCnt,
    mobileIncrementFunction: mobileIncrementFunction
}