// // import { initializeApp} from 'firebase/app';
// // import {getFirestore} from 'firebase/firestore';

// const initializeApp = require("firebase/app");
// const getFirestore = require('firebase/firestore');

// const firebaseConfig = {
//   apiKey: "AIzaSyAWWx9YVb4DkyXTcB-pYkMhzpusJTP2-jw",
//   authDomain: "instameal-891fc.firebaseapp.com",
//   projectId: "instameal-891fc",
//   storageBucket: "instameal-891fc.appspot.com",
//   messagingSenderId: "196649093589",
//   appId: "1:196649093589:web:a63f218ed3e9a832fb555c"
// };

// const app = initializeApp(firebaseConfig);

// const db = getFirestore(app);
// const Recipes = db.collection("recipes");
// module.exports = Recipes;
// Initialize Firebase

const admin = require('firebase-admin');
const credentials = require('./key.json');
admin.initializeApp({
  credential: admin.credential.cert(credentials)
});
const db = admin.firestore();
module.exports = db