// imports
import { createApp } from 'vue'

// imports 
import router from './router.js';
import store from './store/index.js';

import Button from "./components/ui/Button.vue";
import Card from "./components/ui/Card.vue";
import Spinner from "./components/ui/Spinner.vue";

import App from './App.vue'

// app
const app = createApp(App);



app.use(router);
app.use(store);

app.component("Button", Button);
app.component("Card", Card);
app.component("Spinner", Spinner);

app.mount('#app');


// firebase

import { initializeApp } from 'firebase/app';
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

const config = {
    apiKey: "AIzaSyD8TfxGvV-99IPZFldKa8yu49aL5jSdXjc",
    authDomain: "portfolio-analytics-app.firebaseapp.com",
    projectId: "portfolio-analytics-app",
    storageBucket: "portfolio-analytics-app.appspot.com",
    messagingSenderId: "685088624978",
    appId: "1:685088624978:web:1d28d7db3a934e9f2fea8b",
    measurementId: "G-2PS0EK08JH"
};

initializeApp(config);

