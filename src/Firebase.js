import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAb0rqFKVo4ggjI2zWDCU125V0yfVOgVU4",
  authDomain: "igslog-33fe9.firebaseapp.com",
  databaseURL: "https://igslog-33fe9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "igslog-33fe9",
  storageBucket: "igslog-33fe9.appspot.com",
  messagingSenderId: "701045028607",
  appId: "1:701045028607:web:4974605ff2bdfc233b7eca"
};

const fireDB = firebase.initializeApp(firebaseConfig);


export const storage = firebase.storage();

export default fireDB;
