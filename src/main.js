// imports
import { createApp } from 'vue'

import router from './router.js';
import store from './store/index.js';

import BarChart from "./components/ui/BarChart.vue";
import Button from "./components/ui/Button.vue";
import Card from "./components/ui/Card.vue";

import App from './App.vue'

// app
const app = createApp(App);

app.use(router);
app.use(store);

app.component("BarChart", BarChart);
app.component("Button", Button);
app.component("Card", Card);

app.mount('#app');