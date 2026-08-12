import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./style.css";
import "../../task-01-responsive-website/css/style.css";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount("#app");