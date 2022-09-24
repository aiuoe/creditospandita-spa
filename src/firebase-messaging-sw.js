importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyAEM0RujpZZUeE4Y2TdrmDfJYQ_uDcIuL4",
    authDomain: "creditos-panda.firebaseapp.com",
    projectId: "creditos-panda",
    storageBucket: "creditos-panda.appspot.com",
    messagingSenderId: "707531743803",
    appId: "1:707531743803:web:f02e9c260416061d7bf21e"
});
const messaging = firebase.messaging();