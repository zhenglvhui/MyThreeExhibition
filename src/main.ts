import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const dracoLoader: DRACOLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const app = createApp(App);
app.config.globalProperties.$dracoLoader = dracoLoader;

app.use(store).use(router).mount("#app");
