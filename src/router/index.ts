import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Exhibition from "@/views/Exhibition.vue";
// import Car from "@/views/Car.vue";
// import TestCommonModelRender from "@/views/testCommonModelRender.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Exhibition",
    component: Exhibition,
  },
  // {
  //   path: "/car",
  //   name: "Car",
  //   component: Car,
  // },

  // {
  //   path: "/test",
  //   name: "TestCommonModelRender",
  //   component: TestCommonModelRender,
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
