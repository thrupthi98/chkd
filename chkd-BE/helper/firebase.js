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
            timestamp: new Date(message.dateSent).getTime().toString()
        }).then(result => {
            resolve(true)
        }).catch(error => {
            console.log(error);
            reject(error);
        })
    })
}

// function signInUser(email, pass) {
//     return new Promise((resolve, reject) => {
//         admin.auth().signInWithEmailAndPassword(email, pass.toString()).then(res => {
//             resolve(res.user.uid)
//         }).catch(function(error) {
//             reject(error);
//         })
//     })
// }

function getMessages(uid) {
    return new Promise(async(resolve, reject) => {
        var patientsMessages = []
        var messages = await db.collection('messages').doc(uid).collection(uid).get()
        messages.forEach(doc => {
            patientsMessages.push(doc.data());
        });
        resolve(patientsMessages)
    })
}

module.exports = {
    fetchUsers: fetchUsers,
    storeMessage: storeMessage,
    getMessages: getMessages,
}