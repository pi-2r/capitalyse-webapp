// firebase
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

import {
    setPersistence,
    getAuth,
    browserLocalPersistence,
} from 'firebase/auth';

const config = {
    apiKey: "AIzaSyD8TfxGvV-99IPZFldKa8yu49aL5jSdXjc",
    authDomain: "portfolio-analytics-app.firebaseapp.com",
    projectId: "portfolio-analytics-app",
    storageBucket: "portfolio-analytics-app.appspot.com",
    messagingSenderId: "685088624978",
    appId: "1:685088624978:web:1d28d7db3a934e9f2fea8b",
    measurementId: "G-2PS0EK08JH"
};

const firebaseApp = initializeApp(config);
getStorage(firebaseApp)

const auth = getAuth();
setPersistence(auth, browserLocalPersistence);