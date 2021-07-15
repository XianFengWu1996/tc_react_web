import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAifimgoDYW389i_T4SlKXWKuzKsgv-prQ",
    authDomain: "foodorder-43af7.firebaseapp.com",
    databaseURL: "https://foodorder-43af7.firebaseio.com",
    projectId: "foodorder-43af7",
    storageBucket: "foodorder-43af7.appspot.com",
    messagingSenderId: "369761240989",
    appId: "1:369761240989:web:ddda297893ae41b16fd174",
    measurementId: "G-R59065JET5"
};

firebase.initializeApp(firebaseConfig);

export const facebook_provider = new firebase.auth.FacebookAuthProvider().addScope('email')

export const google_provider = new firebase.auth.GoogleAuthProvider().addScope('email')

export default firebase;