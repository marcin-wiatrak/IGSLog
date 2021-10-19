import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/database';

const usersFirebase = firebase.initializeApp(
  {
    apiKey: 'AIzaSyDhgtW6nrmJGXXcOTDZHZnzvBWbgrtk1yM',
    authDomain: 'igs-devdb.firebaseapp.com',
    databaseURL:
      'https://igslog-33fe9-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'igslog-33fe9',
    storageBucket: 'igslog-33fe9.appspot.com',
    messagingSenderId: '701045028607',
    appId: '1:701045028607:web:4974605ff2bdfc233b7eca',
  },
  'usersFirebase'
);

export default usersFirebase;
