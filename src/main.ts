import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 触发webpack 对只有 interface 和 type 导入导出不进行热更新的bug
require("@/ts/interface/commonInterface")
require("@/ts/interface/modelRender")

const app = createApp(App);

app.use(store).use(router).mount("#app");
