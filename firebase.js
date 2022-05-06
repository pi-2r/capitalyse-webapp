// firebase

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

import {
    // getFirestore,
    // collection,
    // getDocs,
    // deleteDoc, 
    // doc,
    // getDoc,
    // addDoc,
    // updateDoc
} from 'firebase/firestore'
import {
    setPersistence,
    getAuth,
    browserLocalPersistence
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


// const db = getFirestore();

// const colRef = collection(db, 'users', 'user1', 'files', 'transactionsFile', 'file');

// get docs

// getDocs(colRef)
//     .then((snapshot) => {
//         let files = [];
//         snapshot.docs.forEach((doc) => {
//             files.push({ ...doc.data() });
//         }
//         )
//         console.log(files);
//     })
//     .catch(error => {
//         console.log(error);
//     })

// const accountFile = {
//     0: ['time', 'price', 'amount', 'total'],
//     1: ['2019-01-01', '100', '10', '1000'],
//     2: ['2019-01-02', '200', '20', '2000'],
//     3: ['2019-01-03', '300', '30', '3000'],
//     4: ['2019-01-04', '400', '40', '4000'],
//     5: ['2019-01-05', '500', '50', '5000'],
// };

// add doc

// addDoc(colRef, accountFile)

// delete doc

// const docRef = doc(db, 'users', 'user1', 'files', 'transactionsFile');


// deleteDoc(docRef)
//     .then(() => {
//         console.log('Document successfully deleted!');

//         getDocs(colRef)
//             .then((snapshot) => {
//                 let files = [];
//                 snapshot.docs.forEach((doc) => {
//                     files.push({ ...doc.data() });
//                 }
//                 )
//                 console.log(files);
//             })
//             .catch(error => {
//                 console.log(error);
//             })
//     })
//     .catch(error => {
//         console.error('Error removing document: ', error);
//     });

// const q = query(colRef, where("time", "==", "2019-01-01"));

// get one doc

// const docRef = doc(db, 'users', 'user1', 'files', 'transactionsFile', 'file', 'B2X3rPjklaaa5VbRvXvL');

// getDoc(docRef)
//     .then((doc) => {
//         console.log(doc.data());
//     })

// update doc

// const updateDocRef = doc(db, 'users', 'user1', 'files', 'transactionsFile', 'file', 'B2X3rPjklaaa5VbRvXvL');

// updateDoc(updateDocRef, {
//     0: ['time', 'price', 'amount', 'total'],
//     1: ['2019-01-01', '100', '10', '1000'],
//     2: ['2019-01-02', '200', '20', '2000'],
//     3: ['2019-01-03', '300', '30', '3000'],
//     4: ['2019-01-04', '400', '40', '4000'],
//     5: ['2019-01-05', '500', '50', '5000'],
//     6: ['2019-01-06', '600', '60', '6000'],
//     7: ['2019-01-07', '700', '70', '7000'],
//     8: ['2019-01-08', '800', '80', '8000'],
//     9: ['2019-01-09', '900', '90', '9000'],
//     10: ['2019-01-10', '1000', '100', '10000'],
//     11: ['2019-01-11', '1100', '110', '11000'],
//     12: ['2019-01-12', '1200', '120', '12000'],
//     13: ['2019-01-13', '1300', '130', '13000'],
//     14: ['2019-01-14', '1400', '140', '14000'],

// }).then(() => {
//     console.log('Document successfully updated!');
// })