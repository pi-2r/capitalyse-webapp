// imports
import { createApp } from 'vue'

import router from './router.js';
import store from './store/index.js';

import Button from "./components/ui/Button.vue";
import Card from "./components/ui/Card.vue";
import Spinner from "./components/ui/Spinner.vue";

import App from './App.vue'

console.log(createApp.version);

// app
const app = createApp(App);

app.use(router);
app.use(store);

app.component("Button", Button);
app.component("Card", Card);
app.component("Spinner", Spinner);

app.mount('#app');