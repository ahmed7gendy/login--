// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase, ref, push, set } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBXLhnKuTXRFX5PkjaR7m1d8H-_s1UQjrM",
  authDomain: "para-fdf7c.firebaseapp.com",
  databaseURL: "https://para-fdf7c-default-rtdb.firebaseio.com",
  projectId: "para-fdf7c",
  storageBucket: "para-fdf7c.appspot.com",
  messagingSenderId: "1098599277771",
  appId: "1:1098599277771:web:417daeb561bb13e453274e",
  measurementId: "G-SZCCFG0GK8"
};

const app = initializeApp(firebaseConfig);
const existingAuth = getAuth(app);

const auth = existingAuth || initializeAuth(app, {
  persistence: 'local', 
});

const database = getDatabase(app);
const storage = getStorage(app);

export { auth, app, database, ref, push, set, storage };