import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./style.css";
import "../../task-01-responsive-website/css/style.css";

createApp(App).use(router).mount("#app");
