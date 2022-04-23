


import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD8TfxGvV-99IPZFldKa8yu49aL5jSdXjc",
    authDomain: "portfolio-analytics-app.firebaseapp.com",
    projectId: "portfolio-analytics-app",
    storageBucket: "portfolio-analytics-app.appspot.com",
    messagingSenderId: "685088624978",
    appId: "1:685088624978:web:1d28d7db3a934e9f2fea8b",
    measurementId: "G-2PS0EK08JH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);



// Add a second document with a generated ID.
import { addDoc, collection } from "firebase/firestore"; 

try {
    const docRef = await addDoc(collection(db, "users"), {
        first: "Alan",
        middle: "Mathison",
        last: "Turing",
        born: 1912
    });

    console.log("Document written with ID: ", docRef.id);
} catch (e) {
    console.error("Error adding document: ", e);
}