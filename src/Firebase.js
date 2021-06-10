import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/database';

const fireDB = firebase.initializeApp({
  apiKey: 'AIzaSyDhgtW6nrmJGXXcOTDZHZnzvBWbgrtk1yM',
  authDomain: 'igs-devdb.firebaseapp.com',
  databaseURL:
    'https://igs-devdb-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'igs-devdb',
  storageBucket: 'igs-devdb.appspot.com',
  messagingSenderId: '1070129629009',
  appId: '1:1070129629009:web:782af395fc6573a192b570',
});

export default fireDB;
