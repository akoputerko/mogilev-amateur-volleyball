import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import "./index.css";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./pages/Index.vue"),
      children: [
        { path: "", component: () => import("./pages/StandingsPage.vue") },
        { path: "tours", component: () => import("./pages/ToursPage.vue") },
        { path: "teams", component: () => import("./pages/TeamsPage.vue") },
        { path: "teams/:id", component: () => import("./pages/TeamPage.vue") },
        { path: "playoff", component: () => import("./pages/PlayoffPage.vue") },
        { path: "playground", component: () => import("./pages/PlaygroundPage.vue") },
        { path: "calendar", component: () => import("./pages/Calendar.vue") },
      ],
    },
    { path: "/:pathMatch(.*)*", component: () => import("./pages/NotFound.vue") },
  ],
});

createApp(App).use(router).mount("#root");
