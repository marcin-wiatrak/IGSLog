import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAb0rqFKVo4ggjI2zWDCU125V0yfVOgVU4',
  authDomain: 'igslog-33fe9.firebaseapp.com',
  databaseURL:
    'https://igs-devdb-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'igs-devdb',
  storageBucket: 'igs-devdb.appspot.com',
  messagingSenderId: '1070129629009',
  appId: '1:1070129629009:web:782af395fc6573a192b570',
  measurementId: 'G-RY9KXMHJYC',
};

const fireDB = firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();

export default fireDB;
